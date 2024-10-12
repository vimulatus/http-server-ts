# Web Server

In order to communicate over a network, the data sent over the network must conform to a specific format called a "protocol".

## Layers of protocols

Network protocols are divided into different layers, where the higher layer depends on the lower layer, and each layer provides different capacities.

```
    top
     /\     | App |     message or whatever
     ||     | TCP |     byte stream
     ||     | IP  |     packets
   bottom   | ... |
```


# TCP

The layer below TCP is the IP layer. Each IP packet is a message with 3 components:
* The sender's address.
* The receiver's address.
* The message data.

Communication with a packet-based scheme is not easy. There are lots of problems for applications to solve:
* What is the message data exceeds the capacity of a single packet ?
* What if the packet is lost ?
* Out-of-order packets ?

To make things simple, the next layer is added on top of IP packets. TCP provides:
* Byte streams instead of packets.
* Reliable and ordered delivery.

A byte stream is simply an ordered sequence of bytes. A protocol, rather than the application, is used to make sense of these bytes.

TCP is a bidirectional channel for transmitting raw bytes - a carrier for other application protocols such as HTTP or SSH.

Although each direction of a TCP connection can operate independently, many protocols follow the request-reponse model. The client sends a request, then the server sends a response, then the client might use the same connection for further requests and responses.

```
    client          server
    ------          ------
    
    | req1 |    =>
                <=  | res1 |
    | req2 |    =>
                ...
```

## TCP Start with a Handshake

To establish a TCP connection, there should be a client and a server. The server waits for the client at a specific address (IP + port), this step is called bind & listen.

Then the client can connect to that address. The "connect" operation involves a 3-step handshake (SYN, SYN-ACK, ACK).

After this, the connection can be accepted by the server.

# UDP

UDP is on the same layer as TCP, but is still packet-based like the lower layer. UDP just adds port numbers over IP packets.

## Byte Stream vs Packet

DNS runs on UDP, the client sends a single request message and the server responds with a single response message.

A DNS message is encapsulated in a UDP packet.

```
    | IP header |       IP payload          |
                \.........................../
                | UDP header | UDP payload |
                             \............./
                             | DNS message |
```

Due to the drawbacks of packet-based protocols, eg. the inability to use large messages, DNS is also designed to run on TCP. But, TCP knows nothing about "message", so when sending DNS messages over TCP, a 2-byte length field is prepended to each DNS message so that the server or client can tell which part of the byte stream is which message.

# HTTP

An HTTP request or response consists of a header followed by an optional payload.

The header contains the URL of the request, or the response code, followed by a list of header fields.

The first line of the request - `GET / HTTP/1.0` - contains the HTTP method `GET`, the URI `/`, and the HTTP version `1.0`.

The first line of the response - `HTTP/1.0 200 OK` - contains the HTTP version and the response code `200`.

## CLI Tools

CLI tools allow for quick testing and debugging.

```
    nc example.com 80 <request.txt

    curl http://example.com/
```

Most sites support HTTPS alongside plaintext HTTP. HTTPS adds an extra protocol layer called "TLS" between HTTP and TCP. 
TLS is not plaintext, so you cannot use netcat to test an HTTPS server.

But TLS still provides a byte stream like TCP, so you just need to replace netcat with a TLS client.
```
    openssl s_client -verify_quiet -quiet -connect example.com:443
```
