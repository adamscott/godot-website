server_port = ENV.fetch("SERVER_PORT") { 4000 }
server_ssl_port = ENV.fetch("SERVER_SSL_PORT") { 4443 }
server_ssl_key = ENV.fetch("SERVER_SSL_KEY") { nil }
server_ssl_cert = ENV.fetch("SERVER_SSL_CERT") { nil }
server_host = ENV.fetch("SERVER_HOST") { "127.0.0.1" }

bind_address = "tcp://#{server_host}:#{server_port}"

bind bind_address

if server_ssl_key != nil and server_ssl_cert != nil
  ssl_bind server_host, server_port_ssl, {
    key: server_ssl_key,
    cert: server_ssl_cert,
  }
end

