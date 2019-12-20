import ReactDom from 'react-dom';

let didWarnAboutChild = false;

export function findDOMNode(component) {
  return ReactDom.findDOMNode(component);
}

export function warnAboutFunctionChild() {
  if (didWarnAboutChild) {
    return;
  }

  didWarnAboutChild = true;
  console.error(
    'With React 0.14 and later versions, you no longer need to wrap <ScrollArea> child into a function.',
  );
}

export function positiveOrZero(number) {
  return number < 0 ? 0 : number;
}

export function modifyObjValues(obj, modifier = x => x) {
  const modifiedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) modifiedObj[key] = modifier(obj[key]);
  }

  return modifiedObj;
}
