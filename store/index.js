export const state = () => ({
  authUser: null
})

export const mutations = {
  SET_USER: function (state, user) {
    state.authUser = user
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.authUser) {
      commit('SET_USER', req.session.authUser)
    }
  },
  async login({ commit }, { username, password }) {
    this.$axios.setHeader('Content-Type', 'application/json', [
      'post'
    ])
    this.$axios.setHeader('accept', 'application/json', [
      'post'
    ])
    try {
      // original auth-routes code doesn't work since it used the "normal Axios package" instead of the Nuxt module.
      //const { data } = await this.$axios.$post(process.env.API_HOST + '/api/login', { username, password })

      // non-destructuring code works!
      const data = await this.$axios.$post(process.env.API_HOST + '/api/login', { username, password })
      console.log('data', data)
      commit('SET_USER', data)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async logout({ commit }) {
    console.log('var', process.env.API_HOST)
    await this.$axios.$post(process.env.API_HOST + '/api/logout')
    commit('SET_USER', null)
  }

}
