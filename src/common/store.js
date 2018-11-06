class Store {
    constructor() {
        this.state = {};
    }

    destroy() {
        this.state = null;
    }

    set(item, val) {
        if (item && typeof item === 'object') {
            Object.keys(item).forEach(key => {
                this.state[key] = item[key];
            });
        }
        else if (item) {
            this.state[item] = val;
        }
    }

    get(item) {
        if (item in this.state) {
            return this.state[item];
        }

        return null;
    }
}

export default {
    create() {
        const store = new Store();
        return {
            set(item, val) {
                store.set(item, val);
            },
            get(item) {
                return store.get(item);
            },
            destroy() {
                store.destroy();
            }
        };
    }
};
