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
      const { data } = await this.$axios.$post('http://durabledrupal.net:5900/api/login', { username, password })
      console.log('data', data)
      // commit('SET_USER', data)
      commit('SET_USER', { 'username': username })
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async logout({ commit }) {
    await this.$axios.$post('http://durabledrupal.net:5900/api/logout')
    commit('SET_USER', null)
  }

}
