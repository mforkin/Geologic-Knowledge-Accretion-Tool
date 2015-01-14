import com.typesafe.config.ConfigFactory

/**
 * Created by mike on 1/13/15.
 */
trait Service {
  val conf = ConfigFactory.load()
}
