<template>
  <div>
    <div class="result" @click="openMenu">
      <div v-for="item in result" :key="item" class="result-item">
        <div class="result-item-body" :style="{'background-color': secondaryColor} ">
          <span v-if="item.leftOperand">{{ item.leftOperand }}</span>
          <span v-if="item.operator">{{ item.operator }}</span>
          <span v-if="item.rightOperand">{{ item.rightOperand }}</span>
          <button @click.stop="removeResultItem(item)" class="round-button delete-button"><span><svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="times"
              class="svg-inline--fa fa-times fa-w-11"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 352 512"><path
              fill="currentColor"
              d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg></span>
          </button>
        </div>
        <span class="result-item-next" v-if="item.next">{{ item.next }}</span></div>
    </div>
    <div class="menu-container" @click-outside="closeMenu">
      <!--      Operands menu-->
      <div :class="[showOperandsMenu? 'operand-menu show' : 'hide']">
        <ul>
          <li v-for="operand in operands" :key="operand" @click.prevent="calculateResult('operand', operand)">
            {{ operand }}
          </li>
        </ul>
      </div>
      <!--      Operator menu-->
      <div :class="[showOperatorsMenu? 'operand-menu show' : 'hide']">
        <ul>
          <li v-for="operator in operators" :key="operator" @click.prevent="calculateResult('operator', operator)">
            {{ operator }}
          </li>
        </ul>
      </div>
      <!--      Value menu-->
      <div :class="[showValueMenu? 'show' : 'hide']">
        <div class="value-menu">
          <label>Search Value</label>
          <input ref="valueElement" v-model="valueModel" @keyup.enter="calculateResult('value', valueModel)">
          <div>
            <button :class="{'background-color': primaryColor}" @click="calculateResult('value', valueModel)">{{ submitBtnText }}</button>
          </div>
        </div>
      </div>
      <!--And / Or-->
      <div :class="[showAndOrMenu? 'operand-menu show' : 'hide']">
        <ul>
          <li @click.prevent="calculateResult('ANDOR', 'AND')">
            AND
          </li>
          <li @click.prevent="calculateResult('ANDOR', 'OR')">
            OR
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>

import {ref, watch} from "vue";

export default {
  name: 'App',
  props: {
    operands: Array,
    operators: Array,
    submitBtnText: {
      type: String,
      default: "SUBMIT"
    },
    primaryColor: {
      type: String,
      default: "#9c27b0"
    },
    secondaryColor: {
      type: String,
      default: "#e8e8e8"
    }
  },
  setup(props) {
    const operands = ref(['test', 'test']);
    // eslint-disable-next-line no-unused-vars
    watch(() => props.operands, (oldOperands, newOperands) => {
      operands.value.push(...newOperands);
    })
    const showOperandsMenu = ref(false);

    const operators = ref(['>', '=', '>='])
    watch(() => props.operators, (oldOperators, newOperators) => {
      operators.value.push(...newOperators)
    })
    const showOperatorsMenu = ref(false)

    const showValueMenu = ref(false)
    const valueModel = ref('')
    const valueElement = ref(null)
    const result = ref([])

    const showAndOrMenu = ref(false);
    const openMenu = () => {
      if (result.value.length === 0 || (result.value.at(-1).operator && result.value.at(-1).rightOperand && result.value.at(-1).next)) {
        showOperandsMenu.value = true
      } else if (result.value.at(-1).operator === null) {
        showOperatorsMenu.value = true
      } else if (result.value.at(-1).rightOperand === null) {
        showValueMenu.value = true
        valueElement.value.focus()
      } else {
        showAndOrMenu.value = true;
      }
    }


    const closeMenu = () => {
      showOperandsMenu.value = false
      showValueMenu.value = false
      showValueMenu.value = false
      showAndOrMenu.value = false

    }

    const calculateResult = (type, value) => {
      switch (type) {
        case 'operand':
          result.value.push({
            leftOperand: value,
            operator: null,
            rightOperand: null,
            next: null
          })
          showOperandsMenu.value = false
          break
        case 'operator':
          result.value.at(-1).operator = value;
          showOperatorsMenu.value = false;
          break
        case 'value':
          result.value.at(-1).rightOperand = value;
          valueModel.value = '';
          showValueMenu.value = false;
          break;
        case 'ANDOR':
          result.value.at(-1).next = value;
          showAndOrMenu.value = false;
      }
    }

    const removeResultItem = (item) => {
      result.value = result.value.filter((x) => {
        if (x.leftOperand === item.leftOperand)
          if (x.operator === item.operator)
            if (x.rightOperand === item.rightOperand)
              return false
        return true
      })
    }
    const backSpace = () => {
      closeMenu()
      if (result.value.at(-1).next)
        result.value.at(-1).next = null;
      else if (result.value.at(-1).rightOperand)
        result.value.at(-1).rightOperand = null;
      else if (result.value.at(-1).operator)
        result.value.at(-1).operator = null;
      else if (result.value.at(-1).leftOperand)
        result.value.at(-1).leftOperand = null;
    }
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      operands,
      showOperandsMenu,
      // eslint-disable-next-line vue/no-dupe-keys
      operators,
      showOperatorsMenu,
      showValueMenu,
      valueModel,
      valueElement,
      showAndOrMenu,
      result,
      calculateResult,
      removeResultItem,
      openMenu,
      closeMenu,
      backSpace
    }
  }
}
</script>

<style scoped>
.operand-menu {
  position: relative;
  z-index: 10;
  left: 32px;
  width: 250px;
}

.hide {
  display: none;
}

.show {
  display: block;
}

.operand-menu ul {
  list-style: none;
  padding: 16px;
  border-radius: 5px;
  /*box-shadow: 0 30px 40px -20px hsl(229, 6%, 66%);*/
  -webkit-box-shadow: 10px 10px 17px -3px rgba(0, 0, 0, 0.71);
  box-shadow: 10px 10px 17px -3px rgba(0, 0, 0, 0.71);
}

.operand-menu li {
  height: 32px;
  padding: 8px;
  border-radius: 5px;
}

.operand-menu li:hover {
  background-color: #d9d9d9;
  cursor: pointer;
}

.result {
  min-height: 26px;
  min-width: 100px;
  border-style: solid;
  border-width: 1px;
  border-radius: 5px;
  border-color: #525252;
  display: flex;
  padding: 8px;
}

.result-item {
  display: flex;
}

.result-item-body {
  padding: 4px;
  border-radius: 2px;
  background-color: #e8e8e8;
}

.result-item-body > span {
  margin-right: 2px;
}

.result-item-next {
  margin: 0 4px;
  padding: 4px;
  border-radius: 2px;
  background-color: #e8e8e8;
}

.round-button {
  min-width: 8px;
  max-width: 120px;
  text-decoration: none;
  display: inline-block;
  outline: none;
  cursor: pointer;
  border-style: none;
  color: #737373;
  background-color: white;
  border-radius: 100%;
  text-align: center;
}

.round-button:before {
  content: '';
  display: inline-block;;
  vertical-align: middle;
  padding-top: 100%;
}

span {
  display: inline-block;
  vertical-align: middle;
  max-width: 90%;
}

.round-button:active {
  background-color: #a8a8a8;
}

.round-button:hover {
  background-color: #cbcbcb;
}

.delete-button {
  width: 16px;
  margin-left: 4px;
  background-color: #e8e8e8;
}

.value-menu {
  position: relative;
  padding: 16px;
  width: 250px;
  border-radius: 5px;
  z-index: 10;
  left: 32px;
  -webkit-box-shadow: 10px 10px 17px -3px rgba(0, 0, 0, 0.71);
  box-shadow: 10px 10px 17px -3px rgba(0, 0, 0, 0.71);
}

.value-menu input {
  padding: 8px;
  width: 93%;
}

.value-menu label {
  display: block;
  padding-bottom: 8px;
}

.value-menu div {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}

.value-menu button {
  margin-top: 8px;
  padding: 4px;
  position: relative;
}
</style>
