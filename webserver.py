import http.server
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver

PORT = 8003

Handler = http.server.SimpleHTTPRequestHandler

Handler.extensions_map={'manifest': 'text/chech-menifest',
                        '.html': 'text/html',
                        '.png': 'image/png',
                        '.jpg': 'image/jpg',
                        '.svg': 'image/svg+xml',
                        '.css': 'text/css',
                        '.js': 'text/javascript',
                        '.module.js': 'module',
                        '': 'application/ocet-stream'
                        }

httpd = socketserver.TCPServer(("", PORT), Handler)

print("serving at port", PORT)
httpd.serve_forever()
