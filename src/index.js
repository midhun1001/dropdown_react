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
    this.dropdownInput = React.createRef();
    this.validationProps = () => {
      return (
        typeof this.state.list === 'object' && this.state.list.length > 0
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
        this.setState({ showList: flag }, () => {
          if (this.props.multiselect === true) {
            const li = document.querySelector('#dp__list ul').childNodes;
            li[this.state.currentFocus].style.backgroundColor = '#f5f5f5';
            li[this.state.currentFocus].setAttribute('data-selected', 'active');
          }
        });
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
        this.setState({ input: '', multi: [] });
        this.dropdownInput.current.focus();
      } else {
        this.setState({ input: e.target.value }, () => {
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
      if (this.props.multiselect === true) {
        if (e.type === 'click') {
          if (document.querySelector('#dp__list ul li[data-selected="active"]')) {
            document.querySelector('#dp__list ul li[data-selected="active"]').style.backgroundColor = '';
            document.querySelector('#dp__list ul li[data-selected="active"]').removeAttribute('data-selected');
          }
          e.target.parentNode.setAttribute('data-selected', 'active');
          e.target.parentNode.style.backgroundColor = "#f5f5f5";
          const data = e.target.parentNode.getAttribute('data-value');
          this.setState({ currentFocus: this.state.list.indexOf(data) });
          this.dropdownInput.current.focus();
        }
        const ele = document.querySelector('#dp__list ul li[data-selected="active"]');
        const multi = this.state.multi;
        if (ele && !multi.includes(ele.getAttribute('data-value'))) {
          multi.push(ele.getAttribute('data-value'));
          this.setState({ multi, input: '' }, () => {
            this.dropdownInput.current.style.width = `${this.defaultWidth().multiSelectWidth}px`;
            if (this.props.callback) {
              this.customCallback(e);
            }
          });
        }
      } else {
        e.target.parentNode.setAttribute('data-selected', 'active');
        const data = document.querySelector('#dp__list ul li[data-selected="active"]').getAttribute('data-value');
        this.setState({ input: data }, () => {
          this.dropdownInput.current.focus();
          if (this.props.callback) {
            this.customCallback(e);
          }
        });
      }
    };
    this.removeFromMulti = (val) => {
      if (this.state.multi.includes(val)) {
        const multi = this.state.multi;
        const index = multi.indexOf(val);
        multi.splice(index, 1);
        this.setState({ multi }, () => {
          document.querySelector(`#dp__list ul li[data-value="${val}"]`).style.backgroundColor = '';
          document.querySelector(`#dp__list ul li[data-value="${val}"]`).removeAttribute('data-selected');
          this.dropdownInput.current.focus();
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
      return { __html: `<strong>${text.substr(0, this.state.input.length)}</strong>${text.substr(this.state.input.length)} <span class="list__selected">${this.selected(text)}</span>` };
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
                  data-value={val}
                  key={index}
                >
                  <a dangerouslySetInnerHTML={this.highlight(val)} onClick={(e) => this.setInput(e, val)} />
                </li>
              );
            }
          }
        });
      }
      if (html_li.length === 0 || this.state.list.length === 0 ) {
        html_li.push(
          <li key="no-data">No data</li>
        );
      }
      return html_li;
    };
    this.scrollList = (dir, ele) => {
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
      if (this.validationProps()) {
        const li = document.querySelector('#dp__list ul').childNodes;
        if (e.which === 40) {
          if (li.length - 1 > this.state.currentFocus) {
            this.setState({ currentFocus: this.state.currentFocus + 1 }, () => {
              const prev = li[this.state.currentFocus - 1];
              const next = li[this.state.currentFocus];
              if (prev) {
                prev.style.backgroundColor = '';
                prev.removeAttribute('data-selected');
              }
              if (next) {
                next.style.backgroundColor = '#f5f5f5';
                next.setAttribute('data-selected', 'active');
                this.scrollList('down', next);
              }
            });
          }
        } else if (e.which === 38) {
          if (this.state.currentFocus !== 0) {
            const prev = li[this.state.currentFocus - 1];
            const next = li[this.state.currentFocus];
            prev.style.backgroundColor = '#f5f5f5';
            prev.setAttribute('data-selected', 'active');
            next.style.backgroundColor = '';
            next.removeAttribute('data-selected');
            this.scrollList('up', prev);
            this.setState({ currentFocus: this.state.currentFocus - 1 });
          }
        } else if (e.which === 13) {
          if (typeof this.props.list === 'object' && document.querySelector('#dp__list ul li[data-selected="active"] a')) {
            document.querySelector('#dp__list ul li[data-selected="active"] a').click();
          } else {
            this.setInput(e);
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
    this.placeholder = 'Enter your text';
    if (props) {
      if (props.placeholder) {
        this.placeholder = props.placeholder;
      }
    }
  }
  componentDidMount() {
    this.dropdownInput.current.style.width = `${this.defaultWidth().defaultWidth}px`;
    document.addEventListener('mousedown', this.handleClickOutside);
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
              ref={this.dropdownInput}
              className={`dp__input ${this.props.inputClass ? this.props.inputClass : ''}`}
              value={this.state.input}
              placeholder={this.placeholder}
              onChange={(e) => this.changeInput(e)}
              onKeyDown={(e) => this.select(e)}
              onFocus={(e) => this.FocusEvent(e, true)}
              onBlur={(e) => this.onFocusout(e) }
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
};
export default Dropdown;
