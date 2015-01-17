package io.github.mforkin.web

import io.github.mforkin.database.DataAccess
import io.github.mforkin.service.ObservationService
import org.apache.commons.io.IOUtils
import org.joda.time.DateTime
import org.json4s.JsonAST.JObject
import org.scalatra.servlet.{MultipartConfig, FileUploadSupport}
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.User

/**
 * Created by mike on 1/13/15.
 */


trait ObservationAPI extends API with ObservationService with FileUploadSupport {
  this: DataAccess =>
  configureMultipartHandling(MultipartConfig(maxFileSize = Some(10*1024*1024)))
  get("/") {
    getObservations(params.getAs[String]("queryString"))
  }

  post("/") {
    val map = parsedBody.asInstanceOf[JObject].values
    createObservation(
      new DateTime(map("date").asInstanceOf[BigInt].longValue()),
      map("lat").asInstanceOf[Double],
      map("lon").asInstanceOf[Double],
      map("tags").asInstanceOf[Seq[String]],
      map("description").asInstanceOf[String],
      map("images").asInstanceOf[Seq[String]],
      SecurityContextHolder.getContext.getAuthentication.getPrincipal.asInstanceOf[User].getUsername
    )
  }

  post("/image") {
    val f = fileParams("file")
    val ext = f.getName.split('.').lastOption match {
      case Some(e) => e
      case None => "png"
    }
    saveImage(
      IOUtils.toByteArray(f.getInputStream),
      SecurityContextHolder.getContext.getAuthentication.getPrincipal.asInstanceOf[User].getUsername + "_" + new DateTime().getMillis + "." + ext
    )
  }

  get("/image/:filename") {
    val filename = params("filename")
    val ext = filename.split('.').lastOption match {
      case Some(e) => e
      case None => "png"
    }
    response.setHeader("Accept-Ranges", "bytes")
    //response.setContentType("image/" + ext)
    getImage(filename)
  }
}
