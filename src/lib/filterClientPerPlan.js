import moment from 'moment'

const filterClientPerPlan = (clients, user, date) => {
  filtered_clients = clients.filter((client) => {
    for (const plan of client.plans) {
      const starting_on = moment(plan.starting_on).format("YYYY-MM-DD")
      const ending_on = moment(plan.ending_on).format("YYYY-MM-DD")
      if (moment(date).isSameOrAfter(starting_on) && moment(date).isSameOrBefore(ending_on)){
        if (user.role[0] === "admin") {
          return true
        }
        else {
          for (const ww of client.works_withs) {
            if (ww.plan_id === plan.id && user.id == ww.user_id) {
              return true
            }
          }
        }   
      }
    }
  })

  return filtered_clients
}

export default filterClientPerPlan