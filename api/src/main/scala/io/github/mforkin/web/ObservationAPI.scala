package io.github.mforkin.web

import io.github.mforkin.database.DataAccess
import io.github.mforkin.service.ObservationService
import org.joda.time.DateTime
import org.json4s.JsonAST.JObject
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.User

/**
 * Created by mike on 1/13/15.
 */


trait ObservationAPI extends API with ObservationService {
  this: DataAccess =>

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
}
