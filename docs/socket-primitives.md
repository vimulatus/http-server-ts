# Socket Primitives

When you create a TCP connection, the connection is managed by your OS, and you use the socket handle to refer to the connection in the socket API.

In Linux, a socket handle is simply a file descriptor (fd). 
In Node.js, socket handles are wrapped into JS objects with methods on them.

Any OS handle must be closed by the application to terminate the underlying resource and recycle the handle.

## Listening Socket & Connection Socket

A TCP server listens on a particular address (IP + port) and accepts client connections from that address. The listening address is also represented by a socket handle. And when you accept a new client connection, you get the socket handle of the TCP connection.

Hence, there are 2 types of socket handles:
1. Listening Sockets: Obtained by listening on an address
2. Connection Sockets: Obtained by accepting a client connection from a listening socket.

## End of Transmission

* Closing a socket terminates a connection and cause the TCP FIN to be sent. Closing a handle of any type also recycles the handle itself.
* You can also shutdown your side of the transmission (also send FIN) while still being able to receive data from the peer; this is called a half-open connection.

## List of Socket Primitives

* Listening socket:
    * bind & listen
    * accept
    * close
* Connection socket:
    * read
    * write
    * close
