package io.github.mforkin.web

import org.json4s.{Formats, DefaultFormats}
import org.scalatra.ScalatraServlet
import org.scalatra.json.JacksonJsonSupport


/**
 * Created by mike on 1/13/15.
 */
trait APIMarshalling extends JacksonJsonSupport {
  protected implicit val jsonFormats: Formats = DefaultFormats
}

trait API extends ScalatraServlet with APIMarshalling {
  before() {
    contentType = formats("json")
  }
}
