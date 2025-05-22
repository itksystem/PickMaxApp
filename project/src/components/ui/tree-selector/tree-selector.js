class TreeSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._flatData = [];
    this._treeData = [];
    this._selectedItems = new Set();
  }

  connectedCallback() {
    this.render();
  }

  set data(value) {
    this._flatData = value;
    this._treeData = this.buildTree(value);
    this.render();
  }

  get data() {
    return this._flatData;
  }

  get selectedItems() {
    return Array.from(this._selectedItems);
  }

  // Преобразуем плоский массив в древовидную структуру
  buildTree(items) {
    const itemMap = {};
    const tree = [];

    // Сначала создаём хеш-таблицу элементов по id
    items.forEach(item => {
      itemMap[item.id] = { ...item, children: [] };
    });

    // Затем строим дерево
    items.forEach(item => {
      if (item.parentId) {
        if (itemMap[item.parentId]) {
          itemMap[item.parentId].children.push(itemMap[item.id]);
        }
      } else {
        tree.push(itemMap[item.id]);
      }
    });

    return tree;
  }

  handleCheckboxChange(event, item) {
    event.stopPropagation();
    
    if (event.target.checked) {
      this._selectedItems.add(item.id);
      // Если это родитель, выбираем всех детей
      if (item.children && item.children.length > 0) {
        this.selectAllChildren(item, true);
      }
    } else {
      this._selectedItems.delete(item.id);
      // Если это родитель, снимаем выбор со всех детей
      if (item.children && item.children.length > 0) {
        this.selectAllChildren(item, false);
      }
    }
    
    this.dispatchEvent(new CustomEvent('selection-change', {
      detail: { selectedItems: this.selectedItems }
    }));
  }

  selectAllChildren(item, select) {
    if (select) {
      this._selectedItems.add(item.id);
    } else {
      this._selectedItems.delete(item.id);
    }
    
    if (item.children && item.children.length > 0) {
      item.children.forEach(child => this.selectAllChildren(child, select));
    }
  }

  renderTreeItem(item) {
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = this._selectedItems.has(item.id);
    
    return `
      <li class="tree-item">
        <div class="item-content" data-id="${item.id}">
          ${hasChildren ? 
            `<span class="toggle">▶</span>` : 
            `<span class="spacer"></span>`
          }
          <input 
            type="checkbox" 
            id="item-${item.id}" 
            ${isSelected ? 'checked' : ''}
          >
          <label for="item-${item.id}">${item.name}</label>
        </div>
        ${hasChildren ? `
          <ul class="tree-subtree" style="display: none;">
            ${item.children.map(child => this.renderTreeItem(child)).join('')}
          </ul>
        ` : ''}
      </li>
    `;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .tree {
          list-style: none;
          padding-left: 0;
          font-family: Arial, sans-serif;
        }
        .tree-item {
          margin: 4px 0;
        }
        .item-content {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 4px 0;
        }
        .item-content:hover {
          background-color: #f0f0f0;
        }
        .toggle, .spacer {
          width: 20px;
          display: inline-block;
          text-align: center;
          font-size: 10px;
        }
        .tree-subtree {
          padding-left: 20px;
          list-style: none;
        }
        input[type="checkbox"] {
          margin-right: 8px;
        }
      </style>
      <ul class="tree">
        ${this._treeData.map(item => this.renderTreeItem(item)).join('')}
      </ul>
    `;

    this.shadowRoot.querySelectorAll('.item-content').forEach(el => {
      const id = parseInt(el.dataset.id);
      const item = this.findItemById(id, this._treeData);
      
      const checkbox = el.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', (e) => this.handleCheckboxChange(e, item));
      
      const toggle = el.querySelector('.toggle');
      if (toggle) {
        toggle.addEventListener('click', (e) => {
          e.stopPropagation();
          const subtree = el.parentElement.querySelector('.tree-subtree');
          if (subtree.style.display === 'none') {
            subtree.style.display = 'block';
            toggle.textContent = '▼';
          } else {
            subtree.style.display = 'none';
            toggle.textContent = '▶';
          }
        });
      }
    });
  }

  findItemById(id, items) {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children && item.children.length > 0) {
        const found = this.findItemById(id, item.children);
        if (found) return found;
      }
    }
    return null;
  }
}

customElements.define('tree-selector', TreeSelector);

