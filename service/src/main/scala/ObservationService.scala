/**
 * Created by mike on 1/13/15.
 */
case class Observation(id: Int)

trait ObservationService extends Service {

  def getObservations = {
    List(Observation(1), Observation(2))
  }
}
