function DarkModeToggle() {
const [darkMode, setDarkMode] = React.useState(false);

React.useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
}, [darkMode]);

return (
    <button disabled>
        Toggle Dark Mode
    </button>
);
}

function App() {
const { Container, Row, Col } = ReactBootstrap;
return (
    <Container>
        <Row>
            <Col md={{ offset: 3, span: 6 }}>
                <DarkModeToggle />
                <TodoListCard />
            </Col>
        </Row>
    </Container>
);
}

function TodoListCard() {
const [items, setItems] = React.useState(null);

React.useEffect(() => {
    fetch('/items')
        .then(r => r.json())
        .then(setItems);
}, []);

const onNewItem = React.useCallback(
    newItem => {
        setItems([...items, newItem]);
    },
    [items],
);

const onItemUpdate = React.useCallback(
    item => {
        const index = items.findIndex(i => i.id === item.id);
        setItems([
            ...items.slice(0, index),
            item,
            ...items.slice(index + 1),
        ]);
    },
    [items],
);

const onItemRemoval = React.useCallback(
    item => {
        const index = items.findIndex(i => i.id === item.id);
        setItems([...items.slice(0, index), ...items.slice(index + 1)]);
    },
    [items],
);

if (items === null) return 'Loading...';

return (
    <React.Fragment>
        <AddItemForm onNewItem={onNewItem} />
        {items.length === 0 && (
            <p className="text-center">You have excatly zero items! Add one above!</p>
        )}
        {items.map(item => (
            <ItemDisplay
                item={item}
                key={item.id}
                onItemUpdate={onItemUpdate}
                onItemRemoval={onItemRemoval}
            />
        ))}
    </React.Fragment>
);
}

function AddItemForm({ onNewItem }) {
const { Form, InputGroup, Button } = ReactBootstrap;

    const [newItem, setNewItem] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const submitNewItem = e => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/items', {
            method: 'POST',
            body: JSON.stringify({ name: newItem }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
                onNewItem(item);
                setSubmitting(false);
                setNewItem('');
            });
    };

    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup className="mb-3">
                <Form.Control
                    disabled
                    type="text"
                    placeholder="New Item"
                    aria-describedby="basic-addon1"
                />
                <InputGroup.Append>
                    <Button
                        variant="success"
                        disabled
                    >
                        {submitting ? 'Adding...' : 'Add Item'}
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );
}

function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const { Container, Row, Col, Button } = ReactBootstrap;

    const toggleCompletion = () => {
        fetch(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                completed: !item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(onItemUpdate);
    };

    const removeItem = () => {
        fetch(`/items/${item.id}`, { method: 'DELETE' }).then(() =>
            onItemRemoval(item),
        );
    };

    const createdFormatted = new Date(item.created).toLocaleString();
    const completedFormatted = item.completedTimestamp ? new Date(item.completedTimestamp).toLocaleString() : null;

    console.log(item.completedTimestamp);

    return (
        <Container fluid className={`item ${item.completed && 'completed'}`}>
            <Row>
                <Col xs={1} className="text-center">
                    <Button
                        className="toggles"
                        size="sm"
                        variant="link"
                        disabled 
                    >
                        <i
                            className={`far ${
                                item.completed ? 'fa-check-square' : 'fa-square'
                            }`}
                        />
                    </Button>
                </Col>
                <Col xs={8} className="name">
                    {item.name}
                </Col>
                <Col xs={1} className="text-center remove">
                    <Button
                        size="sm"
                        variant="link"
                        disabled
                        onClick={removeItem}
                    >
                        <i className="fa fa-trash text-danger" />
                    </Button>
                </Col>
                <Col xs={2}>
                    Created: {createdFormatted}
                    {completedFormatted && (
                        <div>Completed: {completedFormatted}</div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
