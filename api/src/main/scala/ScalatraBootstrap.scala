import javax.servlet.ServletContext

import com.typesafe.config.ConfigFactory
import io.github.mforkin.database.DataAccess
import io.github.mforkin.database.DataAccess.{DefaultQueryCache, InMemoryQueryCache}
import io.github.mforkin.web.ObservationAPI
import org.scalatra.{ScalatraServlet, LifeCycle}
import org.scalatra.scalate.ScalateSupport
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.User



/**
 * Created by mike on 1/13/15.
 */

class DefaultServlet extends ScalatraServlet with ScalateSupport  {
  this: DataAccess =>
  get("/") {
    val user = SecurityContextHolder.getContext.getAuthentication.getPrincipal.asInstanceOf[User]
    val conf = ConfigFactory.load()

    contentType = "text/html; charset=UTF-8"
    response.setHeader("X-UA-Compatible", "IE=edge")
    ssp(
      "index",
      "userId" -> "1",
      "userName" -> user.getUsername,
      "isAdmin" -> user.getAuthorities.toArray.foldLeft(false)((isAdmin, auth) => isAdmin || (auth.asInstanceOf[SimpleGrantedAuthority].getAuthority == "ROLE_ADMIN")),
      "version" -> "1.0"
    )
  }
}

class ScalatraBootstrap extends LifeCycle {
  override def init (context: ServletContext): Unit = {
    val conf = ConfigFactory.load()
    val dbFactory = DataAccess.getJndiDBPool(conf.getConfig("db"))

    trait CachingDataAccess extends DataAccess {
      val db = dbFactory
      val cache = new InMemoryQueryCache
    }

    trait NonCachingDataAccess extends DataAccess {
      val db = dbFactory
      val cache = new DefaultQueryCache
    }
    context.mount(new DefaultServlet with NonCachingDataAccess, "/", "gkat")
    context.mount(new ObservationAPI with NonCachingDataAccess, "/rest/observation", "gkat/observation")
  }
}
