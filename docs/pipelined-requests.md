# Pipelined Requests

Pipelining involves a client sending multiple requests to a server without waiting for a response. Responses must then be returned from the server in the same sequence that the requests were received.

If we can send multiple requests at once, without waiting for the responses one by one to send another, the load time could be greatly reduced.
On the server side, the server shouldn't tell the difference because a TCP connection is just a byte stream.

Web browsers do not use pipelined HTTP requests due to buggy servers, they may use multiple concurrent connections instead.

But if you treat TCP data strictly as a continuous stream of bytes, pipelined messages should be indistinguishable, because the parser doesn't depend on the size of the buffered data, it just consumes elements one by one.

> [!WARNING] Deadlock by Pipelining
> Pipelining too many requests can lead to deadlocks, because both the server and the client can be sending at the same time, and if both their send buffers are full, it's deadlocked as they are both stuck at sending and cannot drain the buffer.
