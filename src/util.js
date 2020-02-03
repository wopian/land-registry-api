export function radians(degrees) {
  return degrees * (Math.PI / 180)
}

export function degrees(radians) {
  return radians * (180 / Math.PI)
}

export function derivedPosition(latitude, longitude, range, bearing) {
  const EarthRadius = 6371000 // meters

  const latA = radians(latitude)
  const longA = radians(longitude)
  const angularDistance = range / EarthRadius
  const trueCourse = radians(bearing)

  let lat = Math.asin(
      Math.sin(latA) *
      Math.cos(angularDistance) +
      Math.cos(latA) *
      Math.sin(angularDistance) *
      Math.cos(trueCourse)
  )

  const dlong = Math.atan2(
      Math.sin(trueCourse) * Math.sin(angularDistance) * Math.cos(latA),
      Math.cos(angularDistance) - Math.sin(latA) * Math.sin(lat)
  )

  let long = ((longA + dlong + Math.PI) % (Math.PI * 2)) - Math.PI

  lat = degrees(lat)
  long = degrees(long)

  return { lat, long }
}

export function getNearest (latDB, lat, longDB, long) {
  const radian_lat = radians(lat)
  const radian_long = radians(long)
  const radian_latDB = radians(latDB)
  const radian_longDB = radians(longDB)

   return 6371 * Math.acos(
      Math.cos(radian_lat) *
      Math.cos(radian_latDB) *
      Math.cos(radian_longDB - radian_long) +
      Math.sin(radian_lat) *
      Math.sin(radian_latDB)
  )
}
