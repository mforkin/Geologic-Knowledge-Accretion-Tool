package io.github.mforkin.service

import com.typesafe.config.ConfigFactory
import io.github.mforkin.database.DataAccess

/**
 * Created by mike on 1/13/15.
 */
trait Service {
  this: DataAccess =>

  val conf = ConfigFactory.load()
}
