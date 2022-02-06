export class ErrorHandler extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.message = message;
    }
  
    // The server could not understand the request due to invalid syntax.
    static badRequest(msg: string = "Bad Request") {
      return new ErrorHandler(400, msg)
    }
  
    // Although the HTTP standard specifies "unauthorized", semantically this
    // response means "unauthenticated". That is, the client must authenticate
    // itself to get the requested response.
    static unauthorized(msg: string = "Unauthorized") {
      return new ErrorHandler(401, msg)
    }
  
    // The client does not have access rights to the content; that is, it is
    // unauthorized, so the server is refusing to give the requested resource.
    // Unlike 401 Unauthorized, the client's identity is known to the server.
    static forbidden(msg: string = "Forbidden") {
      return new ErrorHandler(403, msg)
    }
  
    // This response code is reserved for future use. The initial aim for
    // creating this code was using it for digital payment systems, however
    // this status code is used very rarely and no standard convention exists.
    static paymentRequired(msg: string = "Payment Required ") {
      return new ErrorHandler(402, msg)
    }
  
    // The server can not find the requested resource. In the browser, this
    // means the URL is not recognized. In an API, this can also mean that the
    // endpoint is valid but the resource itself does not exist. Servers may
    // also send this response instead of 403 Forbidden to hide the existence
    // of a resource from an unauthorized client. This response code is
    // probably the most well known due to its frequent occurrence on the web.
    static notFound(msg: string = "Not Found") {
      return new ErrorHandler(404, msg)
    }
  
    // This response is sent when the web server, after performing
    // server-driven content negotiation, doesn't find any content that
    // conforms to the criteria given by the user agent.
    static notAcceptable(msg: string = "Not Acceptable") {
      return new ErrorHandler(406, msg)
    }
  
    // The request method is known by the server but is not supported by the
    // target resource. For example, an API may not allow calling DELETE to
    // remove a resource.
    static methodNotAllowed(msg: string = "Method Not Allowed") {
      return new ErrorHandler(405, msg)
    }
  
    // This is similar to 401 Unauthorized but authentication is needed to be
    // done by a proxy.
    static proxyAuthenticationRequired(msg: string = "Proxy Authentication Required") {
      return new ErrorHandler(407, msg)
    }
  
    // This response is sent on an idle connection by some servers, even
    // without any previous request by the client. It means that the server
    // would like to shut down this unused connection. This response is used
    // much more since some browsers, like Chrome, Firefox 27+, or IE9, use
    // HTTP pre-connection mechanisms to speed up surfing. Also note that some
    // servers merely shut down the connection without sending this message.
    static requestTimeout(msg: string = "Request Timeout") {
      return new ErrorHandler(408, msg)
    }
  
    // This response is sent when the requested content has been permanently
    // deleted from server, with no forwarding address. Clients are expected
    // to remove their caches and links to the resource. The HTTP
    // specification intends this status code to be used for "limited-time,
    // promotional services". APIs should not feel compelled to indicate
    // resources that have been deleted with this status code.
    static gone(msg: string = "Gone") {
      return new ErrorHandler(410, msg)
    }
  
    // Server rejected the request because the Content-Length header field is
    // not defined and the server requires it.
    static lengthRequired(msg: string = "Length Required") {
      return new ErrorHandler(411, msg)
    }
  
    // This response is sent when a request conflicts with the current state
    // of the server.
    static conflict(msg: string = "Conflict") {
      return new ErrorHandler(409, msg)
    }
  
    // The client has indicated preconditions in its headers which the server
    // does not meet.
    static preconditionFailed(msg: string = "Precondition Failed") {
      return new ErrorHandler(412, msg)
    }
  
    // Request entity is larger than limits defined by server. The server
    // might close the connection or return an Retry-After header field.
    static payloadTooLarge(msg: string = "Payload Too Large") {
      return new ErrorHandler(413, msg)
    }
  
    // The URI requested by the client is longer than the server is willing to
    // interpret.
    static uriTooLong(msg: string = "URI Too Long") {
      return new ErrorHandler(414, msg)
    }
  
    // The media format of the requested data is not supported by the server,
    // so the server is rejecting the request.
    static unsupportedMediaType(msg: string = "Unsupported Media Type") {
      return new ErrorHandler(415, msg)
    }
  
    // The range specified by the Range header field in the request cannot be
    // fulfilled. It's possible that the range is outside the size of the
    // target URI's data.
    static rangeNotSatisfiable(msg: string = "Range Not Satisfiable") {
      return new ErrorHandler(416, msg)
    }
  
    // The server refuses the attempt to brew coffee with a teapot.
    static imATeapot(msg: string = "I'm a teapot") {
      return new ErrorHandler(418, msg)
    }
  
    // This response code means the expectation indicated by the Expect
    // request header field cannot be met by the server.
    static expectationFailed(msg: string = "Expectation Failed") {
      return new ErrorHandler(417, msg)
    }
  
    // The request was well-formed but was unable to be followed due to
    // semantic errors.
    static unprocessableEntity(msg: string = "Unprocessable Entity (WebDAV)") {
      return new ErrorHandler(422, msg)
    }
  
    // The request was directed at a server that is not able to produce a
    // response. This can be sent by a server that is not configured to
    // produce responses for the combination of scheme and authority that are
    // included in the request URI.
    static misdirectedRequest(msg: string = "Misdirected Request") {
      return new ErrorHandler(421, msg)
    }
  
    // The resource that is being accessed is locked.
    static locked(msg: string = "Locked (WebDAV)") {
      return new ErrorHandler(423, msg)
    }
  
    // The request failed due to failure of a previous request.
    static failedDependency(msg: string = "Failed Dependency (WebDAV)") {
      return new ErrorHandler(424, msg)
    }
  
    // Indicates that the server is unwilling to risk processing a request
    // that might be replayed.
    static tooEarly(msg: string = "Too Early ") {
      return new ErrorHandler(425, msg)
    }
  
    // The server refuses to perform the request using the current protocol
    // but might be willing to do so after the client upgrades to a different
    // protocol. The server sends an Upgrade header in a 426 response to
    // indicate the required protocol(s).
    static upgradeRequired(msg: string = "Upgrade Required") {
      return new ErrorHandler(426, msg)
    }
  
    // The origin server requires the request to be conditional. This response
    // is intended to prevent the 'lost update' problem, where a client GETs a
    // resource's state, modifies it and PUTs it back to the server, when
    // meanwhile a third party has modified the state on the server, leading
    // to a conflict.
    static preconditionRequired(msg: string = "Precondition Required") {
      return new ErrorHandler(428, msg)
    }
  
    // The server is unwilling to process the request because its header
    // fields are too large. The request may be resubmitted after reducing the
    // size of the request header fields.
    static requestHeaderFieldsTooLarge(msg: string = "Request Header Fields Too Large") {
      return new ErrorHandler(431, msg)
    }
  
    // The user has sent too many requests in a given amount of time ("rate
    // limiting").
    static tooManyRequests(msg: string = "Too Many Requests") {
      return new ErrorHandler(429, msg)
    }
  
    // The user agent requested a resource that cannot legally be provided,
    // such as a web page censored by a government.
    static unavailableForLegalReasons(msg: string = "Unavailable For Legal Reasons") {
      return new ErrorHandler(451, msg)
    }
  
    // The request method is not supported by the server and cannot be
    // handled. The only methods that servers are required to support (and
    // therefore that must not return this code) are GET and HEAD.
    static notImplemented(msg: string = "Not Implemented") {
      return new ErrorHandler(501, msg)
    }
  
    // This error response means that the server, while working as a gateway
    // to get a response needed to handle the request, got an invalid
    // response.
    static badGateway(msg: string = "Bad Gateway") {
      return new ErrorHandler(502, msg)
    }
  
    // The server has encountered a situation it does not know how to handle.
    static internalServerError(msg: string = "Internal Server Error") {
      return new ErrorHandler(500, msg)
    }
  
    // The server is not ready to handle the request. Common causes are a
    // server that is down for maintenance or that is overloaded. Note that
    // together with this response, a user-friendly page explaining the
    // problem should be sent. This response should be used for temporary
    // conditions and the Retry-After HTTP header should, if possible, contain
    // the estimated time before the recovery of the service. The webmaster
    // must also take care about the caching-related headers that are sent
    // along with this response, as these temporary condition responses should
    // usually not be cached.
    static serviceUnavailable(msg: string = "Service Unavailable") {
      return new ErrorHandler(503, msg)
    }
  
    // This error response is given when the server is acting as a gateway and
    // cannot get a response in time.
    static gatewayTimeout(msg: string = "Gateway Timeout") {
      return new ErrorHandler(504, msg)
    }
  
    // The HTTP version used in the request is not supported by the server.
    static httpVersionNotSupported(msg: string = "HTTP Version Not Supported") {
      return new ErrorHandler(505, msg)
    }
  
    // The server has an internal configuration error: the chosen variant
    // resource is configured to engage in transparent content negotiation
    // itself, and is therefore not a proper end point in the negotiation
    // process.
    static variantAlsoNegotiates(msg: string = "Variant Also Negotiates") {
      return new ErrorHandler(506, msg)
    }
  
    // The method could not be performed on the resource because the server is
    // unable to store the representation needed to successfully complete the
    // request.
    static insufficientStorage(msg: string = "Insufficient Storage (WebDAV)") {
      return new ErrorHandler(507, msg)
    }
  
    // The server detected an infinite loop while processing the request.
    static loopDetected(msg: string = "Loop Detected (WebDAV)") {
      return new ErrorHandler(508, msg)
    }
  
    // Indicates that the client needs to authenticate to gain network access.
    static networkAuthenticationRequired(msg: string = "Network Authentication Required") {
      return new ErrorHandler(511, msg)
    }
  
    // Further extensions to the request are required for the server to
    // fulfill it.
    static notExtended(msg: string = "Not Extended") {
      return new ErrorHandler(510, msg)
    }
  }