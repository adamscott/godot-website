#!/usr/bin/env python3

import argparse
import collections.abc
import logging
import json
from pathlib import Path
from sys import exit, stderr
from typing import Protocol, cast
from urllib.parse import ParseResult as URLParseResult
from urllib.parse import urlparse, urlencode

import urllib3


logger = logging.getLogger("upload-asset.py")
asset_path: Path
app: str
base_url: URLParseResult
client_id: str | None = None
client_secret: str | None = None
asset_name: str | None = None
asset_tags: list[str] = []
asset_metadata: list[tuple[str, str]] = []
asset_directory: Path | None
asset_directory_force_create: bool
token = ""
folders: dict[str, "Folder"] = {}
http = urllib3.PoolManager()


class Folder:
    def __init__(self, json: dict):
        self.id: str = json["id"]
        self.parent_id: str = json["parentId"]
        self.name: str = json["folderName"]
        self.version: int = json["version"]
        self.links: dict = json["_links"]

    def __str__(self):
        return f'<Folder name="{self.name}" path="{self.path}" ({hex(id(self))})>'

    @property
    def parent(self) -> "Folder | None":
        if self.parent_id not in folders:
            return None
        return folders[self.parent_id]

    @property
    def path(self) -> Path:
        global logger

        path = Path(f"/{self.name}/")
        if self.parent is None:
            return path

        path = self.parent.path.joinpath(f".{path.as_posix()}")
        return path


def test_response_status(
    response: urllib3.BaseHTTPResponse, expected_codes: list[int] = [200]
) -> Exception | None:
    response_body = response.json()

    try:
        error_message: str | None = None

        if response.status == 400:
            error_message = "Request not valid."
        elif response.status == 404:
            error_message = "App not found."
        elif response.status == 413:
            error_message = "Exceeds the maximum upload size."
        elif response.status == 500:
            error_message = "Operation failed."
        elif response.status not in expected_codes:
            error_message = "Unexpected response code."

        if error_message:
            raise Exception(
                f"{error_message} ({response.status}):\n{json.dumps(response_body, indent=2)}"
            )
    except Exception as e:
        logger.error(f"Upload asset failed: {e}")
        return e


def retrieve_token() -> Exception | None:
    global logger, token, url, client_id, client_secret

    logger.info("Retrieving token.")

    if client_id is None:
        raise TypeError("client_id is None.")
    if client_secret is None:
        raise TypeError("client_secret is None.")

    fields = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
        "scope": "squidex-api",
    }
    url = base_url._replace(
        path=Path(base_url.path).joinpath("/identity-server/connect/token").as_posix()
    )
    logger.debug(f"retrieve_token() url:\n{url.geturl()}")

    response = http.request(
        method="POST",
        url=url.geturl(),
        body=urlencode(fields),
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )

    test_result = test_response_status(response)
    if test_result is not None:
        return test_result

    response_body = response.json()
    logger.debug(f"response_body: {json.dumps(response_body, indent=2)}")

    token = response_body["access_token"]


def retrieve_folders() -> Exception | None:
    global token, app

    logger.info("Retrieving folders.")

    if token is None:
        raise TypeError("token is None.")

    url = base_url._replace(
        path=Path(base_url.path).joinpath(f"/api/apps/{app}/assets/folders").as_posix()
    )
    logger.debug(f"retrieve_folders() url:\n{url.geturl()}")

    response = http.request(
        method="GET", url=url.geturl(), headers={"Authorization": f"Bearer {token}"}
    )

    test_result = test_response_status(response)
    if test_result is not None:
        return test_result

    response_body = response.json()

    for item in response_body["items"]:
        folder = Folder(item)
        folders[folder.id] = folder

    logger.debug(f"Folders:\n{json.dumps(folders, indent=2)}")


def upload_asset() -> Exception | None:
    global \
        logger, \
        asset_path, \
        app, \
        base_url, \
        asset_name, \
        token, \
        asset_tags, \
        asset_metadata, \
        folders

    logger.info("Uploading asset.")

    if token is None:
        raise TypeError("token is None.")

    url = base_url._replace(
        path=Path(base_url.path).joinpath(f"/api/apps/{app}/assets").as_posix()
    )
    logger.debug(f"upload_asset() url:\n{url.geturl()}")

    fields: dict = {
        "file": (asset_path.name, open(asset_path, "rb").read()),
    }

    if asset_name is not None:
        fields["name"] = asset_name

    response = http.request(
        method="POST",
        url=url.geturl(),
        headers={
            "Authorization": f"Bearer {token}",
        },
        fields=fields,
    )

    test_result = test_response_status(response, expected_codes=[201])
    if test_result is not None:
        return test_result

    response_body = response.json()

    logger.debug(f"Asset upload:\n{json.dumps(response_body, indent=2)}")

    def update_asset() -> Exception | None:
        logger.info("Uploading asset. (Updating asset.)")

        updated_tags: list[str] = [*response_body["tags"], *asset_tags]
        updated_metadata: dict = response_body["metadata"]
        update_json: dict = {}

        for metadata_tuple in asset_metadata:
            updated_metadata[metadata_tuple[0]] = metadata_tuple[1]

        if len(asset_tags) > 0:
            update_json["tags"] = updated_tags

        if len(asset_metadata) > 0:
            update_json["metadata"] = updated_metadata

        update_link = response_body["_links"]["update"]
        logger.debug(f"Asset update update_link: {json.dumps(update_link, indent=2)}")

        update_url = base_url._replace(
            path=Path(base_url.path).joinpath(update_link["href"]).as_posix()
        )

        logger.debug(f"Asset update update_json: {json.dumps(update_json, indent=2)}")

        update_response = http.request(
            method=update_link["method"],
            url=update_url.geturl(),
            headers={
                "Authorization": f"Bearer {token}",
            },
            json=update_json,
        )

        update_test_response = test_response_status(
            update_response, expected_codes=[200]
        )
        if update_test_response is not None:
            return update_test_response

        update_response_body = update_response.json()

        logger.debug(f"Asset update:\n{json.dumps(update_response_body, indent=2)}")

    def move_asset() -> Exception | None:
        global asset_directory, asset_directory_force_create

        logger.info("Uploading asset. (Moving asset.)")

        def get_folder_id_by_directory(directory: Path) -> str | None:
            logger.info(
                f"Uploading asset. (Moving asset.) (get_folder_id_by_directory({directory}))"
            )
            global folders

            for folder in folders.values():
                if folder.path == directory:
                    return folder.id

            return None

        def create_asset_folder(directory: Path) -> Exception | Folder:
            logger.info(
                f"Uploading asset. (Moving asset.) (create_asset_folder({directory}))"
            )
            global token, app

            logger.info(f"Creating asset directory for `{directory}`.")

            if token is None:
                return TypeError("token is None.")

            if directory == Path("/"):
                return ValueError("directory is root.")

            url = base_url._replace(
                path=Path(base_url.path)
                .joinpath(f"/api/apps/{app}/assets/folders")
                .as_posix()
            )
            logger.debug(
                f"move_asset() create_asset_folder({directory}) url:\n{url.geturl()}"
            )

            parent_id = get_folder_id_by_directory(directory.parent)

            create_asset_directory_json = {
                "folderName": directory.name,
            }

            if parent_id is not None:
                create_asset_directory_json["parentId"] = parent_id

            logger.debug(
                f"move_asset() create_asset_folder() create_asset_directory_json: {json.dumps(create_asset_directory_json, indent=2)}"
            )

            create_asset_directory_response = http.request(
                method="POST",
                url=url.geturl(),
                headers={"Authorization": f"Bearer {token}"},
                json=create_asset_directory_json,
            )

            test_create_asset_directory_result = test_response_status(
                response, expected_codes=[201]
            )
            if test_create_asset_directory_result is not None:
                return test_create_asset_directory_result

            create_asset_directory_response_body = (
                create_asset_directory_response.json()
            )

            logger.debug(
                f"move_asset() create_asset_folder() create_asset_directory_response_body: {json.dumps(create_asset_directory_response_body, indent=2)}"
            )

            new_folder_id = create_asset_directory_json["id"]
            new_folder = Folder(create_asset_directory_response_body)
            folders[new_folder_id] = new_folder

            return new_folder

        def force_create_directory(directory: Path) -> Exception | str:
            logger.info(
                f"Uploading asset. (Moving asset.) (force_create_directory({directory}))"
            )

            last_created_id = ""
            directories_to_test = [directory]
            directory_parent = directory.parent
            while directory_parent is not None:
                if directory_parent == Path("/"):
                    break
                directories_to_test.append(directory_parent)
                directory_parent = directory_parent.parent

            directories_to_test = list(reversed(directories_to_test))

            logger.debug(
                f"force_create_directory: directories_to_test: {directories_to_test}"
            )

            for directory_to_test in directories_to_test:
                logger.debug(
                    f"force_create_directory: directory_to_test: {directory_to_test}"
                )

                folder_id = get_folder_id_by_directory(directory_to_test)
                logger.debug(f"folder_id: {folder_id}")
                if folder_id is None:
                    return_value = create_asset_folder(directory_to_test)
                    logger.debug(f"folder_id: return_value: {return_value}")
                    if not isinstance(return_value, Folder):
                        return return_value
                    last_created_id = return_value.id

            return last_created_id

        parent_folder_id: str | None = None

        if asset_directory is None:
            return Exception("asset_directory is None")

        parent_folder_id_or_exception = get_folder_id_by_directory(asset_directory)
        logger.debug(
            f"move_asset() parent_folder_id_or_exception: {parent_folder_id_or_exception}"
        )
        if parent_folder_id_or_exception is None:
            logger.debug("move_asset() parent_folder_id_or_exception is None.")
            if not asset_directory_force_create:
                return Exception(
                    "Did not find parent folder. Use the `--force-create-asset-directory` option to force create recursively the directories."
                )
            parent_folder_id_or_exception = force_create_directory(asset_directory)
            if not isinstance(parent_folder_id_or_exception, str):
                return Exception("Did not find parent folder.")
        parent_folder_id = parent_folder_id_or_exception
        logger.debug(f"move_asset() parent_folder_id: {parent_folder_id}")

        move_json: dict = {"parentId": parent_folder_id}

        move_link = response_body["_links"]["move"]
        logger.debug(f"move_asset() move_link: {json.dumps(move_link, indent=2)}")

        move_url = base_url._replace(
            path=Path(base_url.path).joinpath(move_link["href"]).as_posix()
        )

        logger.debug(f"move_asset() move_json: {json.dumps(move_json, indent=2)}")

        move_response = http.request(
            method=move_link["method"],
            url=move_url.geturl(),
            headers={
                "Authorization": f"Bearer {token}",
            },
            json=move_json,
        )

        move_test_response = test_response_status(move_response, expected_codes=[200])
        if move_test_response is not None:
            return move_test_response

        move_response_body = move_response.json()

        logger.debug(
            f"move_asset() move_response_body: {json.dumps(move_response_body, indent=2)}"
        )

    if len(asset_tags) > 0 or len(asset_metadata) > 0:
        update_asset_return_value = update_asset()
        if update_asset_return_value is not None:
            logger.error(f"Error while updating asset: {update_asset_return_value}")
            return update_asset_return_value

    if asset_directory is not None:
        move_asset_return_value = move_asset()
        if move_asset_return_value is not None:
            logger.error(
                f"Error while moving asset to directory: {move_asset_return_value}"
            )
            return move_asset_return_value


def main(args: "ArgsProtocol"):
    global \
        logger, \
        asset_path, \
        app, \
        base_url, \
        client_id, \
        client_secret, \
        asset_name, \
        asset_tags, \
        asset_metadata, \
        asset_directory, \
        asset_directory_force_create, \
        token

    logging.basicConfig(
        stream=stderr,
        level=logging.ERROR
        if args.verbose == 0
        else logging.DEBUG
        if args.verbose >= 2
        else logging.INFO,
    )

    asset_path = args.asset_path

    if args.squidex_app is None:
        raise TypeError("No app is set.")
    app = args.squidex_app

    if args.squidex_url is None:
        raise TypeError("No url is set.")

    base_url = args.squidex_url
    client_id = args.squidex_client_id
    client_secret = args.squidex_client_secret

    if args.asset_name is not None:
        asset_name = args.asset_name

    asset_tags = args.asset_tag
    asset_metadata = args.asset_metadata
    asset_directory = args.asset_directory
    asset_directory_force_create = args.force_create_asset_directory

    if asset_directory is not None and not asset_directory.is_absolute():
        # Make sure that `asset_directory` is absolute (i.e. has root slash).
        asset_directory = Path(f"/{asset_directory.as_posix()}")

    if args.squidex_client_token is None:
        error = retrieve_token()
        if error is not None:
            exit(1)
    else:
        token = args.squidex_client_token

    if args.asset_path is not None:
        error = retrieve_folders()
        if error is not None:
            exit(1)

    error = upload_asset()
    if error is not None:
        exit(1)

    logger.info(f'Uploaded asset "{asset_path}" successfully.')


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    def url_validator(url):
        parsed_url = urlparse(url)
        if all((parsed_url.scheme, parsed_url.netloc)):
            return parsed_url
        raise argparse.ArgumentTypeError("Invalid URL.")

    class ValidateAssetDirectory(argparse.Action):
        def __call__(self, parser, namespace, values, option_string=None):
            if values is None:
                return
            if isinstance(values, list) or isinstance(values, collections.abc.Sequence):
                raise argparse.ArgumentTypeError("Value cannot be a list.")
            path_asset_directory = Path(values)
            if path_asset_directory == Path("/"):
                raise argparse.ArgumentTypeError("Cannot be root, as it is by default.")
            setattr(namespace, self.dest, Path(values))

    parser.register("type", "url", url_validator)
    parser.add_argument(
        "-v", "--verbose", help="Enable verbose mode.", action="count", default=0
    )
    parser.add_argument("-u", "--squidex-url", help="Squidex instance URL.", type="url")
    parser.add_argument(
        "-a",
        "--squidex-app",
        help="Squidex instance app.",
        type=str,
        default="godot-blog",
    )
    parser.add_argument(
        "-i",
        "--squidex-client-id",
        help="Squidex instance client id.",
        type=str,
        default="godot-blog:default",
    )
    parser.add_argument(
        "-s",
        "--squidex-client-secret",
        help="Squidex instance client secret.",
        type=str,
    )
    parser.add_argument(
        "-T", "--squidex-client-token", help="Squidex instance client token.", type=str
    )
    parser.add_argument(
        "-m",
        "--asset-metadata",
        help="Asset metadata to set.",
        nargs=2,
        metavar=("key", "value"),
        type=str,
        default=[],
        action="append",
    )
    parser.add_argument(
        "-t",
        "--asset-tag",
        help="Asset tag to set.",
        type=str,
        default=[],
        action="append",
    )
    parser.add_argument("-n", "--asset-name", help="Asset name.", type=str)
    parser.add_argument(
        "-d",
        "--asset-directory",
        help="Asset directory.",
        type=Path,
        action=ValidateAssetDirectory,
    )
    parser.add_argument(
        "-D",
        "--force-create-asset-directory",
        help="Force create asset directory if it doesn't exist.",
        action=argparse.BooleanOptionalAction,
    )
    parser.add_argument("asset_path", help="Asset to upload.", type=Path)

    args = parser.parse_args()
    main(cast("ArgsProtocol", args))


class ArgsProtocol(Protocol):
    verbose: int
    squidex_url: URLParseResult | None
    squidex_app: str | None
    squidex_client_id: str | None
    squidex_client_secret: str | None
    squidex_client_token: str | None
    asset_metadata: list[tuple[str, str]]
    asset_tag: list[str]
    asset_name: str | None
    asset_directory: Path | None
    force_create_asset_directory: bool
    asset_path: Path
