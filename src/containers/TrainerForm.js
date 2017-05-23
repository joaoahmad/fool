import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import classNames from 'classnames/bind';
import styles from './styles.scss';

const cx = classNames.bind(styles);

class TrainerForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  }

  render() {
    const { handleSubmit } = this.props;
    const { results, fetching, input } = this.state;
    return (
      <form onSubmit={handleSubmit}>
        <div className={cx('container')}>
          <div className={cx('row')}>
            <textarea
              onChange={this.onChange}
              className={cx('textarea')}
              value={input}
            />
          </div>
          <div className={cx('selections')}>
            <div className={cx('row row--vertical')}>
              <div>Subjects</div>
              <Field name='subjects' component='input' type='text' className={cx('input')} />
            </div>
            <button onClick={this.onSubmit} className={cx('button')} disabled={fetching}>
              {!fetching ? 'Analisar' : 'Loading...'}
            </button>
          </div>
          <pre className={cx('output')}>
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      </form>
    );
  }
}

const selector = formValueSelector('trainer');
const mapStateToProps = state => ({
  subjects: selector(state, 'subjects'),
  terms: selector(state, 'terms'),
});

export default connect(mapStateToProps)(reduxForm({ form: 'trainer' })(TrainerForm));
