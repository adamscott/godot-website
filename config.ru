require 'marcel'
require 'puma'
require 'puma/launcher'
require 'rack'
require 'uri'

$s3_bucket = ENV.fetch('S3_BUCKET') { 'https://website-storage.nbg1.your-objectstorage.com/' }

class AssetInterceptor
  def initialize(app)
    @app = app
  end

  def call(env)
    request = Rack::Request.new(env)

    if request.path.start_with?('/assets/') or request.path.start_with?('/storage/')
      return handle_asset_call(env,
                               request)
    end

    @app.call(env)
  end

  def handle_asset_call(env, request)
    local_path = '_site' + request.path
    return handle_asset_local_call(env, request, local_path) if File.exist?(local_path)

    handle_asset_bucket_call(env, request)
  end

  def handle_asset_local_call(_env, request, local_path)
    file = File.open(local_path, 'rb')

    content_type = Marcel::MimeType.for(Pathname.new(local_path))

    case content_type
    when 'text/plain'
      case request.path
      when /\.css$/i
        content_type = 'text/css'
      when /\.js$/i
        content_type = 'text/javascript'
      end
    when 'application/octet-stream'
      case request.path
      when /\.css$/i
        content_type = 'text/css'
      when /\.js$/i
        content_type = 'text/javascript'
      end
    end

    [
      200, # OK.
      {
        'Content-Type' => content_type,
        'Content-Length' => File.size(local_path).to_s,
        'Content-Transfer-Encoding' => 'binary'
      },
      file
    ]
  end

  def handle_asset_bucket_call(env, request)
    env.select { |k, _v| k.start_with? 'HTTP_' }
       .collect { |key, val| [key.sub(/^HTTP_/, ''), val] }
       .collect { |key, val| "#{key}: #{val}<br>" }
       .sort

    url = URI($s3_bucket)
    url.path = request.path

    [
      # 308, # Permanent Redirect.
      307, # Temporary Redirect.
      {
        'Location' => url.to_s
      },
      []
    ]
  end
end

app = Rack::Builder.new do
  use AssetInterceptor
  use Rack::Static,
      urls: [''], # Empty string means everything under root.
      root: '_site',
      index: 'index.html'

  run lambda { |_env|
    [
      404, # Not Found.
      { 'Content-Type' => 'text/plain' },
      ['File not found.']
    ]
  }
end

puma_config = Puma::Configuration.new do |user_config|
  user_config.load './puma_config.rb'
  user_config.app app
end

launcher = Puma::Launcher.new(puma_config)
launcher.run
