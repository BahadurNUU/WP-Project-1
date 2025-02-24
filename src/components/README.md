# Components

## Button

### Description
The `Button` component is a reusable button element with customizable styles.

### Files
- [Button.jsx](Button/Button.jsx)
- [Button.css](Button/Button.css)

### Usage
```jsx
import Button from '../Button/Button';

<Button type="primary">Click Me</Button>
```

### Props
- **children** (node): The content inside the button.
- **type** (string): The button style type. Default is 'primary'.



## Card

### Description
The `Card` component is a container with a header and content section, used to display information in a card format.

### Files
- [Card.jsx](Card/Card.jsx)
- [Card.css](Card/Card.css)


### Usage
```jsx
import  Card  from  '../Card/Card';

<Card  title="Card Title"  type="light">
	<p>Card content goes here.</p>
</Card>
```

### Props
- **title** (string): The title of the card.
- **type** (string): The card style type. Default is 'light'.
- **children** (node): The content inside the card.



## Label

### Description

The  Label  component is a small text label with customizable styles.

### Files

- [Label.jsx](Label/Label.jsx)
- [Label.css](Label/Label.css)

### Usage
```jsx
import  Label  from  '../Label/Label';

<Label  text="Label Text"  type="primary"  />
```

### Props
- **text** (string): The text content of the label.
- **type** (string): The label style type. Default is 'secondary'.




## List

### Description

The  List  component is a container for displaying a list of items with an optional header.

### Files

- [List.jsx](List/List.jsx)
- [List.css](List/List.css)

### Usage
```jsx
import  List  from  '../List/List';

<List
	title="List Title"
	data={[{ name:  'Item 1' }, { name:  'Item 2' }]}
	render={(item, index) =>  <li  key={index}>{item.name}</li>}
/>
```

### Props

- **title**  (string): The title of the list.
- **data**  (array): The array of data items to display.
- **render**  (function): The function to render each item in the list.



## Modal

### Description

The  Modal  component is a dialog box that appears on top of the current page content.

### Files

- [Modal.jsx](Modal/Modal.jsx)
- [Modal.css](Modal/Modal.css)

### Usage
```jsx
import  Modal  from  '../Modal/Modal';

<Modal
	open={isOpen}
	title="Modal Title"
	onClose={() =>  setIsOpen(false)}
	footerButtons={[
		{ text:  'Close', handler: () => setIsOpen(false) }
	]}
>

	<p>Content to display</p>

</Modal>
```


### Props

- **open**  (boolean): Whether the modal is open or not.
- **title**  (string): The title of the modal.
- **width**  (number): The width of the modal. Default is 400.
- **onClose**  (function): The function to call when the modal is closed.
- **footerButtons**  (array): The array of buttons to display in the modal footer.
- **children**  (node): The content inside the modal.



## Sidebar

### Description

The  Sidebar  component is a vertical navigation menu for switching between different pages.

### Files

- [Sidebar.jsx](Sidebar/Sidebar.jsx)
- [Sidebar.css](Sidebar/Sidebar.css)

### Usage

```jsx
import  Sidebar  from  '../Sidebar/Sidebar';

<Sidebar  onPageChange={(page) =>  setPage(page)}  />
```

### Props

- **onPageChange**  (function): The function to call when a page is changed.