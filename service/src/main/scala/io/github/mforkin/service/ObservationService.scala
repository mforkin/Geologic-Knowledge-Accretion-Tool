package io.github.mforkin.service

import java.sql.Timestamp

import io.github.mforkin.database.DataAccess
import io.github.mforkin.database.jooq.generated.Tables._
import org.joda.time.DateTime
import org.jooq.impl.Factory
import collection.JavaConverters._

/**
 * Created by mike on 1/13/15.
 */

case class Observation (id: Int, date: DateTime, lat: Double, lon: Double, tags: Seq[String], description: String, images: Seq[String])


trait ObservationService extends Service {
  this: DataAccess =>

  import db._

  def getObservations (queryString: Option[String] = None) = {
    val q = selectFrom(OBSERVATION)

    (queryString match {
      case Some(qs) if qs.length > 0 => q.where(
        OBSERVATION.DESCRIPTION.upper().like("%" + qs.toUpperCase + "%")
          .or(Factory.`val`(qs.toUpperCase).like(OBSERVATION.DESCRIPTION))
          .or(OBSERVATION.ID.in(
            selectDistinct(OBSERVATION.ID)
              .from(OBSERVATION)
              .join(OBSERVATION_TAGS).on(OBSERVATION.ID.equal(OBSERVATION_TAGS.OBSERVATION_ID))
              .join(TAGS).on(OBSERVATION_TAGS.TAG_ID.equal(TAGS.ID))
              .where(TAGS.TAG.upper().like("%" + qs.toUpperCase + "%").or(
              Factory.`val`(qs.toUpperCase).like(TAGS.TAG)
            ))
          ))
      )
      case _ => q
    }).fetch.asScala.map(r => Observation(
      r.getId.toInt,
      new DateTime(r.getDate.getTime),
      r.getLat.doubleValue(),
      r.getLon.doubleValue(),
      getObservationTags(r.getId),
      r.getDescription,
      getObservationImages(r.getId)
    ))
  }

  def getObservationTags (id: Int) = {
    select()
      .from(TAGS).join(OBSERVATION_TAGS).on(TAGS.ID.equal(OBSERVATION_TAGS.TAG_ID))
      .where(OBSERVATION_TAGS.OBSERVATION_ID.equal(id))
      .fetch.asScala.map(_.getValue(TAGS.TAG)).toSeq
  }

  def getObservationImages (id: Int) = {
    selectFrom(OBSERVATION_IMAGES).where(OBSERVATION_IMAGES.OBSERVATION_ID.equal(id))
      .fetch.asScala.map(_.getFilename).toSeq
  }

  def createObservation (date: DateTime, lat: Double, lon: Double, tags: Seq[String], description: String, images: Seq[String], username: String) = {
    val newObs = insertInto(
      OBSERVATION,
      OBSERVATION.DATE,
      OBSERVATION.DESCRIPTION,
      OBSERVATION.LAT,
      OBSERVATION.LON,
      OBSERVATION.USERNAME
    )
    .values(
      new Timestamp(date.getMillis),
      description,
      Double.box(lat),
      Double.box(lon),
      username
    ).returning().fetchOne()

    val tagIds = tags.map(t => {
      select(TAGS.ID).from(TAGS).where(TAGS.TAG.equal(t)).fetch() match {
        case l if l.size() > 0 => l.asScala.head.getValue(TAGS.ID)
        case _ => insertInto(TAGS, TAGS.TAG, TAGS.USERNAME).values(t, username).returning.fetchOne().getId
      }
    })

    val newTags = insertInto(
      OBSERVATION_TAGS,
      OBSERVATION_TAGS.OBSERVATION_ID,
      OBSERVATION_TAGS.TAG_ID,
      OBSERVATION_TAGS.USERNAME
    )

    tagIds.foldLeft(newTags)((tot, tId) => tot.values(newObs.getId, tId, username)).execute()

    Observation(
      newObs.getId,
      new DateTime(newObs.getDate.getTime),
      newObs.getLat.doubleValue(),
      newObs.getLon.doubleValue(),
      tags,
      newObs.getDescription,
      images
    )
  }
}
