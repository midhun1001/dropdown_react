import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: this.props.list.sort(),
      input: '',
      showList: false,
      currentFocus: 0,
      multi: [],
      arrDir: '',
    };
    this.validationProps = () => {
      return (
        typeof this.state.list === 'object'
      );
    };
    this.handleClickOutside = (e) => {
      if (!document.getElementById('customizable-dropdown').contains(e.target)) {
        this.setState({ showList: false });
      }
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.onFocusout = (e) => {
      if (this.props.onblur) {
        e.persist();
        const data = {
          currentInput: this.state.input,
          event: e
        };
        if (this.props.multiselect === true) {
          data.multiSelect = this.state.multi;
        }
        this.props.onblur(data);
      }
    };
    this.FocusEvent = (e, flag) => {
      if (this.validationProps()) {
        e.persist();
        this.setState({ showList: flag });
        if (flag) {
          this.setState({ arrDir: 'arrow_down' });
        } else {
          this.setState({ arrDir: '' });
        }
        if (this.props.focus) {
          const focusData = {
            currentInput: this.state.input,
            event: e
          };
          if (this.props.multiselect === true) {
            focusData.multiSelect = this.state.multi;
          }
          this.props.focus(focusData);
        }
      }
    };
    this.changeInput = (e, flag) => {
      e.persist();
      const callBack = {};
      if (flag === 'clear') {
        this.setState({ input: '', multi: [], currentFocus: 0 }, () => {
          document.getElementById('dp__input').style.width = `${this.defaultWidth().defaultWidth}px`;
        });
        document.getElementById('dp__input').focus();
      } else {
        this.setState({ input: e.target.value, currentFocus: 0 }, () => {
          if (this.props.callback) {
            callBack.currentInput = this.state.input;
            callBack.event = e;
            if (this.props.multiselect === true) {
              callBack.multiSelect = this.state.multi;
            }
            this.props.callback(callBack);
          }
        });
      }
    };
    this.defaultWidth = () => {
      let multiWidth = 0;
      const parentWidth = document.getElementsByClassName('dp')[0].offsetWidth;
      const closeWidth = document.getElementsByClassName('dp__clear')[0].offsetWidth;
      if (this.props.multiselect === true) {
        multiWidth = document.getElementsByClassName('dp__selectedInput')[0].offsetWidth;
      }
      const defaultWidth = parentWidth - closeWidth;
      const multiSelectWidth = defaultWidth - multiWidth;
      return {
        defaultWidth,
        multiSelectWidth
      };
    };
    this.customCallback = (e) => {
      const callBack = {
        currentInput: this.state.input,
        event: e
      };
      if (this.props.multiselect === true) {
        callBack.multiSelect = this.state.multi
      }
      this.props.callback(callBack);
    };
    this.setInput = (e, input) => {
      e.persist();
      const list = this.state.list;
      const multi = this.state.multi;
      if (this.props.multiselect) {
        if (!multi.includes(input)) {
          multi.push(input);
          this.setState({ currentFocus: list.indexOf(input), multi },() => {
            document.getElementById('dp__input').focus();
            document.getElementById('dp__input').style.width = `${this.defaultWidth().multiSelectWidth}px`;
          });
        }
      } else {
        this.setState({ input });
      }
    };
    this.removeFromMulti = (val) => {
      if (this.state.multi.includes(val)) {
        const multi = this.state.multi;
        const index = multi.indexOf(val);
        multi.splice(index, 1);
        this.setState({ multi }, () => {
          if (this.state.multi.length === 0) {
            document.getElementById('dp__input').style.width = `${this.defaultWidth().defaultWidth}px`;
          }
        });
      }
    };
    this.renderMulti = () => {
      return (
        this.state.multi.map((val, index) => (
          <div className="multiselect__item" key={index}>
            <span>
              <button onClick={() => this.removeFromMulti(val)}>
                &#10005;
              </button>
              {val}
            </span>
          </div>
        ))
      );
    };
    this.selected = (text) => {
      if (this.state.multi.includes(text)) {
        return (
          'Selected'
        );
      }
      return '';
    }
    this.highlight = (text) => {
      return (
        { __html: `<strong>${text.substr(0, this.state.input.length)}</strong>${text.substr(this.state.input.length)} <span class="list__selected">${this.selected(text)}</span>` }
      )
    };
    this.focusItem = (index) => {
      let classname = '';
      let status = '';
      if (index === this.state.currentFocus) {
        classname = 'highlight';
        status = 'active';
      }
      return {
        classname,
        status
      };
    };
    this.renderList = () => {
      const html_li = [];
      if (typeof this.state.list ==='object' && this.state.list.length > 0) {
        this.state.list.map((val, index) => {
          if (typeof val === 'object') {
            if (val.text.substr(0, this.state.input.length).toLowerCase() === this.state.input.toLowerCase()) {
              html_li.push(
                <li data-value={val.text} key={index}>
                  <a href={val.href} dangerouslySetInnerHTML={this.highlight(val.text)} />
                </li>
              );
            }
          } else {
            if (val.substr(0, this.state.input.length).toLowerCase() === this.state.input.toLowerCase()) {
              html_li.push(
                <li
                  className={`${this.focusItem(index).classname}`}
                  data-value={val}
                  key={index}
                  data-selected={this.focusItem(index).status}
                >
                  <a dangerouslySetInnerHTML={this.highlight(val)} onClick={(e) => this.setInput(e, val)} />
                </li>
              );
            }
          }
        });
      }
      if (this.props.async === true && this.state.list.length === 0) {
        html_li.push(
          <li className={this.props.loadingClass ? this.props.loadingClass : 'animate-flicker'} key="loading">
            {
              this.props.loadingText ? this.props.loadingText : 'Loading...'
            }
          </li>
        );
      } else if (html_li.length === 0 || this.state.list.length === 0 ) {
        html_li.push(
          <li key="no-data">No data</li>
        );
      }
      return html_li;
    };
    this.scrollList = (dir) => {
      const li = document.querySelector('#dp__list ul').childNodes;
      const ele = li[this.state.currentFocus];
      if (dir === 'down') {
        const divHeight = document.getElementById('dp__list').offsetHeight;
        const scrollPos = document.getElementById('dp__list').scrollTop;
        const elePos = ele.offsetTop;
        const eleHei = ele.offsetHeight;
        if (elePos > divHeight) {
          document.getElementById('dp__list').scrollTop = scrollPos + eleHei;
        }
      } else {
        const scrollPos = document.getElementById('dp__list').scrollTop;
        const elePos = ele.offsetTop;
        const eleHei = ele.offsetHeight;
        if (elePos < scrollPos) {
          document.getElementById('dp__list').scrollTop = scrollPos - eleHei;
        }
      }
    };
    this.select = (e) => {
      if (this.validationProps() && document.querySelector('#dp__list ul')) {
        const li = document.querySelector('#dp__list ul').childNodes;
        if (e.which === 40) {
          if (li.length - 1 > this.state.currentFocus) {
            this.setState({ currentFocus: this.state.currentFocus + 1 }, () => this.scrollList('down'));
          }
        } else if (e.which === 38) {
          if (this.state.currentFocus !== 0) {
            this.setState({ currentFocus: this.state.currentFocus - 1 }, () => this.scrollList('up'));
          }
        } else if (e.which === 13) {
          if (typeof this.props.list === 'object') {
            li[this.state.currentFocus].getElementsByTagName('a')[0].click()
          }
        } else if (e.which === 8) {
          if (this.state.input === '' && this.props.multiselect === true && this.state.multi.length > 0) {
            this.removeFromMulti(this.state.multi[this.state.multi.length -1]);
          }
        }
        if (this.props.keydown) {
          const focusData = {
            currentInput: this.state.input,
            event: e
          };
          if (this.props.multiselect === true) {
            focusData.multiSelect = this.state.multi;
          }
          this.props.keydown(focusData);
        }
      }
    };
    this.disableInput = (flag) => {
      if (flag === true) {
        let inputClassnames = document.getElementById('dp__input').className;
        inputClassnames += ` disabled`
        document.getElementById('dp__input').setAttribute('class', inputClassnames);
      }
    };
    this.placeholder = 'Enter your text';
    if (props) {
      if (props.placeholder) {
        this.placeholder = props.placeholder;
      }
    }
  }
  componentDidMount() {
    document.getElementById('dp__input').style.width = `${this.defaultWidth().defaultWidth}px`;
    document.addEventListener('mousedown', this.handleClickOutside);
    if (this.props.disabled === true) {
      this.disableInput(true);
    }
    if (this.props.autofocus === true) {
      document.getElementById('dp__input').focus();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.list !== this.props.list) {
      this.setState({ list: nextProps.list.sort() });
    }
  }
  render() {
    return (
      <div
            id="customizable-dropdown"
            className={`dp ${this.props.containerClass ? this.props.containerClass: ''}` }
          >
            {
              this.props.multiselect && this.props.multiselect === true &&
              <div className="dp__selectedInput">
                {this.renderMulti()}
              </div>
            }
            <input
              id="dp__input"
              className={`dp__input ${this.props.inputClass ? this.props.inputClass : ''}`}
              value={this.state.input}
              placeholder={this.placeholder}
              onChange={(e) => this.changeInput(e)}
              onKeyDown={(e) => this.select(e)}
              onFocus={(e) => this.FocusEvent(e, true)}
              onBlur={(e) => this.onFocusout(e) }
              disabled={this.props.disabled === true  ? this.props.disabled : false}
            />
            <button className="dp__clear" onClick={(e) => this.changeInput(e, 'clear')}>
              <span className={`${this.state.arrDir} arrow`} >&#8227;&nbsp;</span>
              <span>&#10005;</span>
             </button>
            {
              this.state.showList &&
              <div
                id="dp__list"
                className={`dp__list ${this.state.listClass ? this.state.listClass : ''}`}
                style={this.dp__list_style}
                >
                <ul>
                  { this.renderList() }
                </ul>
              </div>
            }
          </div>
    );
  }
}
Dropdown.propTypes = {
  list: PropTypes.array.isRequired,
  multiselect: PropTypes.bool,
  placeholder: PropTypes.string,
  callback: PropTypes.func,
  onblur: PropTypes.func,
  focus: PropTypes.func,
  keydown: PropTypes.func,
  disabled: PropTypes.bool,
  autofocus: PropTypes.bool,
  async: PropTypes.bool,
  loadingClass: PropTypes.string,
  loadingText: PropTypes.string

};
export default Dropdown;
