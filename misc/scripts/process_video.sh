#!/usr/bin/env bash

GODOT_WEBSITE_FFMPEG="${GODOT_WEBSITE_FFMPEG:-ffmpeg}"
QUALITY="2M"
INPUT=""
OUTPUT=""

show_help() {
	echo "Usage: $(basename "$0") [-q=2M] [-h] input output"
	echo "  -q Quality"
	echo "  -s Scale 'N:N', with -1 if you want to keep aspect ratio"
	echo "  -h Help"
	returncode="${1:-0}"
	exit "$returncode"
}

test_ffmpeg() {
	if ! command -v "$GODOT_WEBSITE_FFMPEG" >/dev/null 2>&1; then
		echo "Error: did not find '$GODOT_WEBSITE_FFMPEG', ffmpeg is required" >&2
		show_help 1
	fi
}

parse_args() {
	while getopts 'q:s:h' opt; do
		case "$opt" in
			q)
				QUALITY="$OPTARG"
				;;
			s)
				SCALE="$OPTARG"
				;;
			h)
				show_help
				;;
			?)
			show_help 1
			;;
		esac
	done

	if [ "$#" -eq 0 ]; then
		show_help
	fi

	test_ffmpeg

	INPUT=${*:$OPTIND:1}
	OUTPUT=${*:$OPTIND+1:1}

	if [ -z "$INPUT" ]; then
		echo "Error: no input given" >&2
		show_help 1
	fi

	if [ -z "$OUTPUT" ]; then
		echo "Error: no output given" >&2
		show_help 1
	fi
}

main() {
	parse_args "$@"

	declare -a scale_param=()
	if [ -n "$SCALE" ]; then
		scale_param+=("-vf" "scale=$SCALE")
	fi

	set -ex

	pass_one_args=(
		"-i" "$INPUT"
		"-c:v" "libvpx-vp9"
		"-b:v" "$QUALITY"
		"-pass" "1"
		"-an"
		"${scale_param[@]}"
		"-f" "null"
		"$OUTPUT"
	)

	pass_two_args=(
		"-i" "$INPUT"
		"-c:v" "libvpx-vp9"
		"-b:v" "$QUALITY"
		"-pass" "2"
		"-c:a" "libopus"
		"${scale_param[@]}"
		"$OUTPUT"
	)

	"$GODOT_WEBSITE_FFMPEG" "${pass_one_args[@]}"
	"$GODOT_WEBSITE_FFMPEG" "${pass_two_args[@]}"

	set +ex
}

main "$@"
