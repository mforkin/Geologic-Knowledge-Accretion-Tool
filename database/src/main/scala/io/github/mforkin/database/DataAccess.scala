package io.github.mforkin.database

import java.util.Properties
import javax.naming.InitialContext
import javax.sql.DataSource

import com.google.common.cache.{CacheLoader, CacheBuilder}
import com.jolbox.bonecp.{BoneCPConfig, BoneCPDataSource}
import com.typesafe.config.Config
import io.github.mforkin.database.DataAccess.QueryCache
import org.jooq.conf.Settings
import org.jooq.impl.Factory
import org.jooq.{SQLDialect, Field, Record, Select}
import collection.JavaConverters._
import collection.JavaConversions._

import scala.reflect.ClassTag

/**
 * Created by mike on 1/13/15.
 */
trait DataAccess {
  val db: Factory
  implicit val cache: QueryCache

  implicit class RichSelect[S <: Select[_ <: Record]](q: S) {
    def map[A](f: Record=>A)(implicit cache: QueryCache): List[A] = cache.get(q).map(f)

    def flatMap[A](f: Record=>List[A])(implicit cache: QueryCache): List[A] = cache.get(q).flatMap(f)

    def asListOf[T](implicit m: ClassTag[T]): List[T] =
      q.fetch().into(m.runtimeClass).asScala.toList.map(_.asInstanceOf[T])
  }

  implicit class RichRecord(rec: Record) {
    def getOptionalValue[A](field: Field[A]): Option[A] =
      rec.getFields.asScala
        .find(f => f.getName.equals(field.getName))
        .map(rec.getValue(_)).asInstanceOf[Option[A]]
  }

}

object DataAccess {

  trait QueryCache {
    def get(k: Select[_ <: Record]): List[_ <: Record]
  }

  class InMemoryQueryCache extends QueryCache {
    val cache = CacheBuilder.newBuilder().build(
      new CacheLoader[Select[_ <: Record], List[_ <: Record]] {
        def load(stmt: Select[_ <: Record]) = stmt.fetch().asScala.toList
      })

    def get(k: Select[_ <: Record]) = cache.get(k)
  }

  class DefaultQueryCache extends QueryCache {
    def get(stmt: Select[_ <: Record]) = stmt.fetch().asScala.toList
  }

  def buildDBPool(dbConfig: Config) = {
    val props = new Properties
    props.putAll(dbConfig.root().asScala.map { case (k, v) => k -> v.unwrapped().toString })

    Class.forName(dbConfig.getString("driverClass"))

    val dbDS = new BoneCPDataSource(new BoneCPConfig(props))

    new Factory(dbDS, SQLDialect.POSTGRES, new Settings().withRenderFormatted(true))
  }

  def getJndiDBPool(dbConfig: Config) = {

    val jndiLookupName = dbConfig.getString("jndiLookupName")

    val ic = new InitialContext()

    val dbDS = ic.lookup(jndiLookupName).asInstanceOf[DataSource]

    new Factory(dbDS, SQLDialect.POSTGRES, new Settings().withRenderFormatted(true))
  }
}
