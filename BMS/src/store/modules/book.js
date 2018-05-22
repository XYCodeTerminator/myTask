const state = {
  book: {
    name: '',
    category: '',
    stock: '',
    left: '',
    publishTime: '',
    price: '',
    content: '',
    images: [],
    collectors: [],
    subscribers: []
  }
}

const getters = {
  book: state => state.book
}

const actions = {
  editBook({ commit }, { editedItem, router }) {
    commit('editItem', editedItem);
    router.push('bookDetailEdit');
  },
  clearBook({ commit }) {
    commit('clearItem');
  },
  showBookDetail({ commit }, currentBook) {
    commit('showBookDetail', currentBook );
    // router.push('bookDisplay/' + currentBook._id);
  }
}

const mutations = {
  editItem(state, editedItem) {
    state.book = editedItem;
  },
  clearItem(state) {
    state.book = {
      name: '',
      category: '',
      stock: '',
      left: '',
      publishTime: '',
      price: '',
      content: '',
      images: [],
      collectors: [],
      subscribers: []
    }
  },
  showBookDetail(state, currentBook) {
    state.book = currentBook;
  }
}

export default {
  state, 
  getters,
  actions, 
  mutations
}