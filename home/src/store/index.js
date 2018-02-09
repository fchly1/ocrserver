import Vue from 'vue'
import Vuex from 'vuex'
import {host} from '../config/index'
import request from 'superagent'


Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    histories: [],
    isLogin: false,
    cookie: '',
    user: {},
    infoBox: []
  },
  mutations: {
    addlocalHistory(state, data) {
      state.histories.push(data);
    },
    addHistory(state, data) {
      state.histories.push(data);
      if (state.isLogin) {
        request.post('/history/add')
          .send(data)
          .end(function (err, res) {
            if (res.ok) {
              //cb(res.body);
              console.log(res.body);
            }

          })
      }
    },
    clearHistory(state) {
      state.histories = [];
    },
    editLogin(state) {
      state.isLogin = !state.isLogin;
    },
    updateUser(state, user) {
      for (var pop in user) {
        state.user[pop] = user[pop];
      }

    },
    clearUser(state) {
      state.user = {};
    },
    addInfoBox(state, data) {
      var addStuds = _.findIndex(state.infoBox, function (o) {
        return o.info == data.info;
      });
      if (addStuds < 0) {
        state.infoBox.push(data);
      }
    },
    delInfoBox(state, data) {
      var len = state.infoBox.length;
      for (var i = 0; i < len; i++) {
        if (state.infoBox[i].info == data.info) {
          state.infoBox.splice(i, 1);
        }
      }
    }

  }
})

export default store;
