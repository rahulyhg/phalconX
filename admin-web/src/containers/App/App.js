import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {isLoaded as isAuthLoaded, load as loadAuth, logout} from 'redux/modules/auth';
import {push} from 'react-router-redux';
import config from '../../config';
import {asyncConnect} from 'redux-async-connect';

@asyncConnect([
    {
        promise: ({
            store: {
                dispatch,
                getState
            }
        }) => {
            const promises = [];

            if (!isAuthLoaded(getState())) {
                promises.push(dispatch(loadAuth()));
            }

            return Promise.all(promises);
        }
    }
])
@connect(state => ({user: state.auth.user}), {logout, pushState: push})
export default class App extends Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        user: PropTypes.object,
        logout: PropTypes.func.isRequired,
        pushState: PropTypes.func.isRequired
    };

    static contextTypes = {
        store: PropTypes.object.isRequired
    };

    // componentWillReceiveProps(nextProps) {
    // if (!this.props.user && nextProps.user) {
    // } else if (this.props.user && !nextProps.user) {
    //   // logout
    //   this.props.pushState('/');
    // }
    // }

    handleLogout = (event) => {
        event.preventDefault();
        this.props.logout();
    };

    render() {
        const styles = require('./App.scss');

        return (
            <div className={styles.page}>
                <Helmet {...config.app.head}/>
                <header>
                    <div className={styles.bigcontainer}>
                        <div className={styles.logo}>
                            <a href="./">phalconX</a>
                        </div>

                    </div>
                </header>

                {this.props.children}
            </div>
        );
    }
}
