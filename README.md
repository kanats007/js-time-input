# time-input with vanilla js

## What is this ?

add `hh:mm`format to input element.

## how to use

1. install

```
npm install time-inputter
```

import and execute on your app

```js
import { timeInputter } from 'time-inputter';
timeInputter();
```

or download `dist/time-inputter.min.js` file and add script directly

```html
<script type="module">
  import { timeInputter } from '.time-inputter.min.js';
  timeInputter();
</script>
</body>
```

2. add `time-inputter` to className

```html
<input class="time-inputter" value="09:00" />
```

## Dedicated attributes

### value

set a default value.

p.s. need to hh:mm format (/[0-9]{2}:[0-5][0-9]/)

```html
<input class="time-inputter" value="09:00" />
```

### maxHour

set a maximum value for time input.

p.s. need to 2-digit numeric string (/[0-9]{2}/)

```html
<input class="time-inputter" maxHour="23" />
```
