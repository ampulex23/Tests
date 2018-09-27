App = {
    //https://api.flickr.com/services/rest/?method=flickr.galleries.getPhotos&api_key=5f80bacd093c6b9666bf966822eca4b5&gallery_id=72157700009530971&format=json&nojsoncallback=1&api_sig=557e34a3bed31dedc1597998c5838e2f
    //apiKey: 'f389c74bf8ff9e66ee65d5546979922b',
    apiKey: '5f80bacd093c6b9666bf966822eca4b5',
    secret: '17c6b9df401b7998',
    baseUrl: 'https://api.flickr.com/services/rest/',


    galeryId: '72157700009530971',


    init () {

        let t = this;
        t.cmpMain = t.component('info', 'main', {}, {});
        t.cmpFeed = t.component('feed', 'feed', {}, {}, {
            fotos() {
                return App.store.getters.fotos;
            }
        });
        t.router = new VueRouter({routes: [
            {path: '/', name: 'info', component: t.cmpMain},
            {path: '/feed', name: 'feed', component: t.cmpFeed}
        ]});
        t.store = new Vuex.Store({
            state: {
                fotos: [],
                page: 1
            },
            actions: {
                addFotos({commit}, fotos) {
                    commit('ADD_FOTOS', fotos)
                }
            },
            mutations: {
                ADD_FOTOS(state, fotos) {
                    state.fotos = state.fotos.concat(fotos.photo);
                    state.page = fotos.page;
                }
            },
            getters: {
                fotos(state) {
                    return state.fotos
                },
                page(state) {
                    return state.page
                }
            }
        });
        t.vueMain = new Vue({el: '#app', data: t,
            router: t.router,
            store: t.store,
            computed: {
                fotos() {
                    return this.$store.getters.fotos;
                },
                page () {
                    return this.$store.getters.page;
                }
            },
            methods: {
                addFotos(f) {
                    this.$store.dispatch('addFotos', f);
                }
            }}
        );
        t.Api.getGallery(t.galeryId);
        window.onscroll = () => {
            let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
            if (bottomOfWindow) {
                t.Api.getGallery(t.galeryId, parseInt(App.vueMain.page) + 1);
            }
        };
    },

    api (method, params, cb = () => {}) {
        let data = {
            method: 'flickr.' + method,
            api_key: App.apiKey,
            format: 'json',
            nojsoncallback: '1'
        };
        for (let k in params) { data[k] = params[k]; }
        return $.ajax({
            method: 'GET',
            url: App.baseUrl + App.encodeQuery(data),
            data: '{}'
        }).done(data => {
            console.log(data);
            cb(data);
        }).fail(err => {
            console.log(err);
        });
    },
    encodeQuery (data) {
        return Object.keys(data).map((k, i) => (i === 0 ? '?' : '&') + k + '=' + data[k]).join('');
    },
    template (path) {
        return $.ajax({url: 'views/' + path + '.vue', async: false, method: 'GET'}).responseText;
    },
    component (name, tpath, methods = {}, props = {}, computed = {}) {
        return Vue.component(name, {
            template: App.template(tpath),
            data: () => App,
            methods: methods,
            props: props,
            computed
        });
    },

    Api: {

        getGallery (id, page = 1) {
            const cb = arguments.length > 1 && typeof arguments[1] === 'function' ? arguments[1] : () => {};
            App.api('galleries.getPhotos', {gallery_id: id, page: page, per_page: 5}, data => {
                App.vueMain.addFotos(data.photos);
                cb();
            })
        }
    }

};