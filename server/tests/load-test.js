import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 200 },
    { duration: "1m", target: 1000 }, 
    { duration: "30s", target: 0 }, // ramp down
  ],
};

export default function () {
  http.get("http://k8s-hotel-hotelapi-247ba9b6d0-775076997.us-east-1.elb.amazonaws.com/api/rooms");
  sleep(1);
}
