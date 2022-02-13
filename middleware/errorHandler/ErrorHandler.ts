export class ErrorHandler extends Error {
  status: number;
  message: string;
  error: object;
  constructor(status: number, message: string, error: object = {}) {
    super(message);
    this.status = status;
    this.message = message;
    this.error = error;
  }

  // The server could not understand the request due to invalid syntax.
  static badRequest(msg: string = "Bad Request", error?: object) {
    return new ErrorHandler(400, msg, error)
  }

  // Although the HTTP standard specifies "unauthorized", semantically this
  // response means "unauthenticated". That is, the client must authenticate
  // itself to get the requested response.
  static unauthorized(msg: string = "Unauthorized", error?: object) {
    return new ErrorHandler(401, msg, error)
  }

  // The client does not have access rights to the content; that is, it is
  // unauthorized, so the server is refusing to give the requested resource.
  // Unlike 401 Unauthorized, the client's identity is known to the server.
  static forbidden(msg: string = "Forbidden", error?: object) {
    return new ErrorHandler(403, msg, error)
  }

  // This response code is reserved for future use. The initial aim for creating
  // this code was using it for digital payment systems, however this status
  // code is used very rarely and no standard convention exists.
  static paymentRequired(msg: string = "Payment Required ", error?: object) {
    return new ErrorHandler(402, msg, error)
  }

  // The server can not find the requested resource. In the browser, this means
  // the URL is not recognized. In an API, this can also mean that the endpoint
  // is valid but the resource itself does not exist. Servers may also send this
  // response instead of 403 Forbidden to hide the existence of a resource from
  // an unauthorized client. This response code is probably the most well known
  // due to its frequent occurrence on the web.
  static notFound(msg: string = "Not Found", error?: object) {
    return new ErrorHandler(404, msg, error)
  }

  // This response is sent when the web server, after performing server-driven
  // content negotiation, doesn't find any content that conforms to the criteria
  // given by the user agent.
  static notAcceptable(msg: string = "Not Acceptable", error?: object) {
    return new ErrorHandler(406, msg, error)
  }

  // The request method is known by the server but is not supported by the
  // target resource. For example, an API may not allow calling DELETE to remove
  // a resource.
  static methodNotAllowed(msg: string = "Method Not Allowed", error?: object) {
    return new ErrorHandler(405, msg, error)
  }

  // This response is sent on an idle connection by some servers, even without
  // any previous request by the client. It means that the server would like to
  // shut down this unused connection. This response is used much more since
  // some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection
  // mechanisms to speed up surfing. Also note that some servers merely shut
  // down the connection without sending this message.
  static requestTimeout(msg: string = "Request Timeout", error?: object) {
    return new ErrorHandler(408, msg, error)
  }

  // This response is sent when a request conflicts with the current state of
  // the server.
  static conflict(msg: string = "Conflict", error?: object) {
    return new ErrorHandler(409, msg, error)
  }

  // This is similar to 401 Unauthorized but authentication is needed to be done
  // by a proxy.
  static proxyAuthenticationRequired(msg: string = "Proxy Authentication Required", error?: object) {
    return new ErrorHandler(407, msg, error)
  }

  // Server rejected the request because the Content-Length header field is not
  // defined and the server requires it.
  static lengthRequired(msg: string = "Length Required", error?: object) {
    return new ErrorHandler(411, msg, error)
  }

  // This response is sent when the requested content has been permanently
  // deleted from server, with no forwarding address. Clients are expected to
  // remove their caches and links to the resource. The HTTP specification
  // intends this status code to be used for "limited-time, promotional
  // services". APIs should not feel compelled to indicate resources that have
  // been deleted with this status code.
  static gone(msg: string = "Gone", error?: object) {
    return new ErrorHandler(410, msg, error)
  }

  // The client has indicated preconditions in its headers which the server does
  // not meet.
  static preconditionFailed(msg: string = "Precondition Failed", error?: object) {
    return new ErrorHandler(412, msg, error)
  }

  // Request entity is larger than limits defined by server. The server might
  // close the connection or return an Retry-After header field.
  static payloadTooLarge(msg: string = "Payload Too Large", error?: object) {
    return new ErrorHandler(413, msg, error)
  }

  // The URI requested by the client is longer than the server is willing to
  // interpret.
  static uriTooLong(msg: string = "URI Too Long", error?: object) {
    return new ErrorHandler(414, msg, error)
  }

  // The media format of the requested data is not supported by the server, so
  // the server is rejecting the request.
  static unsupportedMediaType(msg: string = "Unsupported Media Type", error?: object) {
    return new ErrorHandler(415, msg, error)
  }

  // The range specified by the Range header field in the request cannot be
  // fulfilled. It's possible that the range is outside the size of the target
  // URI's data.
  static rangeNotSatisfiable(msg: string = "Range Not Satisfiable", error?: object) {
    return new ErrorHandler(416, msg, error)
  }

  // This response code means the expectation indicated by the Expect request
  // header field cannot be met by the server.
  static expectationFailed(msg: string = "Expectation Failed", error?: object) {
    return new ErrorHandler(417, msg, error)
  }

  // The server refuses the attempt to brew coffee with a teapot.
  static imATeapot(msg: string = "I'm a teapot", error?: object) {
    return new ErrorHandler(418, msg, error)
  }

  // The request was directed at a server that is not able to produce a
  // response. This can be sent by a server that is not configured to produce
  // responses for the combination of scheme and authority that are included in
  // the request URI.
  static misdirectedRequest(msg: string = "Misdirected Request", error?: object) {
    return new ErrorHandler(421, msg, error)
  }

  // The request was well-formed but was unable to be followed due to semantic
  // errors.
  static unprocessableEntity(msg: string = "Unprocessable Entity (WebDAV)", error?: object) {
    return new ErrorHandler(422, msg, error)
  }

  // The resource that is being accessed is locked.
  static locked(msg: string = "Locked (WebDAV)", error?: object) {
    return new ErrorHandler(423, msg, error)
  }

  // The request failed due to failure of a previous request.
  static failedDependency(msg: string = "Failed Dependency (WebDAV)", error?: object) {
    return new ErrorHandler(424, msg, error)
  }

  // Indicates that the server is unwilling to risk processing a request that
  // might be replayed.
  static tooEarly(msg: string = "Too Early ", error?: object) {
    return new ErrorHandler(425, msg, error)
  }

  // The server refuses to perform the request using the current protocol but
  // might be willing to do so after the client upgrades to a different
  // protocol. The server sends an Upgrade header in a 426 response to indicate
  // the required protocol(s).
  static upgradeRequired(msg: string = "Upgrade Required", error?: object) {
    return new ErrorHandler(426, msg, error)
  }

  // The origin server requires the request to be conditional. This response is
  // intended to prevent the 'lost update' problem, where a client GETs a
  // resource's state, modifies it and PUTs it back to the server, when
  // meanwhile a third party has modified the state on the server, leading to a
  // conflict.
  static preconditionRequired(msg: string = "Precondition Required", error?: object) {
    return new ErrorHandler(428, msg, error)
  }

  // The user has sent too many requests in a given amount of time ("rate
  // limiting").
  static tooManyRequests(msg: string = "Too Many Requests", error?: object) {
    return new ErrorHandler(429, msg, error)
  }

  // The server is unwilling to process the request because its header fields
  // are too large. The request may be resubmitted after reducing the size of
  // the request header fields.
  static requestHeaderFieldsTooLarge(msg: string = "Request Header Fields Too Large", error?: object) {
    return new ErrorHandler(431, msg, error)
  }

  // The user agent requested a resource that cannot legally be provided, such
  // as a web page censored by a government.
  static unavailableForLegalReasons(msg: string = "Unavailable For Legal Reasons", error?: object) {
    return new ErrorHandler(451, msg, error)
  }

  // The server has encountered a situation it does not know how to handle.
  static internalServerError(msg: string = "Internal Server Error", error?: object) {
    return new ErrorHandler(500, msg, error)
  }

  // The request method is not supported by the server and cannot be handled.
  // The only methods that servers are required to support (and therefore that
  // must not return this code) are GET and HEAD.
  static notImplemented(msg: string = "Not Implemented", error?: object) {
    return new ErrorHandler(501, msg, error)
  }

  // This error response means that the server, while working as a gateway to
  // get a response needed to handle the request, got an invalid response.
  static badGateway(msg: string = "Bad Gateway", error?: object) {
    return new ErrorHandler(502, msg, error)
  }

  // The server is not ready to handle the request. Common causes are a server
  // that is down for maintenance or that is overloaded. Note that together with
  // this response, a user-friendly page explaining the problem should be sent.
  // This response should be used for temporary conditions and the Retry-After
  // HTTP header should, if possible, contain the estimated time before the
  // recovery of the service. The webmaster must also take care about the
  // caching-related headers that are sent along with this response, as these
  // temporary condition responses should usually not be cached.
  static serviceUnavailable(msg: string = "Service Unavailable", error?: object) {
    return new ErrorHandler(503, msg, error)
  }

  // This error response is given when the server is acting as a gateway and
  // cannot get a response in time.
  static gatewayTimeout(msg: string = "Gateway Timeout", error?: object) {
    return new ErrorHandler(504, msg, error)
  }

  // The HTTP version used in the request is not supported by the server.
  static httpVersionNotSupported(msg: string = "HTTP Version Not Supported", error?: object) {
    return new ErrorHandler(505, msg, error)
  }

  // The server has an internal configuration error: the chosen variant resource
  // is configured to engage in transparent content negotiation itself, and is
  // therefore not a proper end point in the negotiation process.
  static variantAlsoNegotiates(msg: string = "Variant Also Negotiates", error?: object) {
    return new ErrorHandler(506, msg, error)
  }

  // The method could not be performed on the resource because the server is
  // unable to store the representation needed to successfully complete the
  // request.
  static insufficientStorage(msg: string = "Insufficient Storage (WebDAV)", error?: object) {
    return new ErrorHandler(507, msg, error)
  }

  // The server detected an infinite loop while processing the request.
  static loopDetected(msg: string = "Loop Detected (WebDAV)", error?: object) {
    return new ErrorHandler(508, msg, error)
  }

  // Further extensions to the request are required for the server to fulfill
  // it.
  static notExtended(msg: string = "Not Extended", error?: object) {
    return new ErrorHandler(510, msg, error)
  }

  // Indicates that the client needs to authenticate to gain network access.
  static networkAuthenticationRequired(msg: string = "Network Authentication Required", error?: object) {
    return new ErrorHandler(511, msg, error)
  }
}