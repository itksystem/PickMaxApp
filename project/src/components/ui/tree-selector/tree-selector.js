class TreeSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._flatData = [];
    this._treeData = [];
    this._selectedItems = new Set();
    this._itemMap = new Map();
    this._expandedItems = new Set();
  }

  connectedCallback() {
    this.setAttribute('role', 'tree');
    this.shadowRoot.addEventListener('change', this._onChange.bind(this));
    this.shadowRoot.addEventListener('click', this._onClick.bind(this));
    this.render();
  }

  set data(value) {
    if (!Array.isArray(value)) {
      console.error('Data must be an array');
      return;
    }
    this._flatData = value;
    this._treeData = this.buildTree(value);
    this._selectedItems.clear();
    this._expandedItems.clear();
    this.render();
  }

  get data() {
    return this._flatData;
  }

  getSelectedItems(returnObjects = false) {
    return returnObjects
      ? this._flatData.filter(item => this._selectedItems.has(item.id))
      : Array.from(this._selectedItems);
  }

  getSelectedLeaves(returnObjects = false) {
    const leaves = [];
    for (const id of this._selectedItems) {
      const item = this._itemMap.get(id);
      if (item && (!item.children || item.children.length === 0)) {
        leaves.push(returnObjects ? item : id);
      }
    }
    return leaves;
  }

  buildTree(items) {
    this._itemMap.clear();
    const tree = [];

    items.forEach(item => {
      const node = { ...item, children: [] };
      item.id = `${item.id}`;
      this._itemMap.set(item.id, node);
    });

    items.forEach(item => {
      const node = this._itemMap.get(item.id);
      if (item.parentId) {
        const parent = this._itemMap.get(item.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          console.warn(`Parent with id ${item.parentId} not found for item ${item.id}`);
        }
      } else {
        tree.push(node);
      }
    });

    return tree;
  }

  _onChange(event) {
    const checkbox = event.target.closest('input[type="checkbox"]');
    if (!checkbox) return;

    const itemId = checkbox.id.replace('item-', '');
    const item = this._itemMap.get(itemId);
    if (!item) return;

    this.handleCheckboxChange(event, item);
  }

  _onClick(event) {
    const toggle = event.target.closest('.toggle');
    const itemContent = event.target.closest('.item-content');

    if (toggle && itemContent) {
      const li = itemContent.closest('li');
      const id = itemContent.dataset.id;
      const expanded = li.getAttribute('aria-expanded') === 'true';
      const subtree = li.querySelector('.tree-subtree');
      subtree.style.display = expanded ? 'none' : 'block';
      toggle.textContent = expanded ? '▶' : '▼';
      li.setAttribute('aria-expanded', expanded ? 'false' : 'true');

      if (expanded) {
        this._expandedItems.delete(id);
      } else {
        this._expandedItems.add(id);
      }

      event.stopPropagation();
      return;
    }

    if (itemContent && !event.target.closest('input')) {
      const checkbox = itemContent.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  handleCheckboxChange(event, item) {
    const wasChecked = this._selectedItems.has(item.id);
    if (event.target.checked) {
      this._selectedItems.add(item.id);
      if (item.children?.length) this._updateChildrenState(item, true);
    } else {
      this._selectedItems.delete(item.id);
      if (item.children?.length) this._updateChildrenState(item, false);
    }

    this.updateParentItems(item);

    if (wasChecked !== event.target.checked) {
      this.dispatchEvent(new CustomEvent('selection-change', {
        detail: {
          selectedIds: Array.from(this._selectedItems),
          selectedItems: this.getSelectedItems(true),
          selectedLeaves: this.getSelectedLeaves(true)
        }
      }));
    }

    this._updateChildrenCheckboxesUI(item, event.target.checked);
    this.updateIndeterminateStates();
  }

  updateIndeterminateStates() {
    this.shadowRoot.querySelectorAll('.item-content').forEach(el => {
      const id = el.dataset.id;
      const item = this._itemMap.get(id);
      const checkbox = el.querySelector('input[type="checkbox"]');

      if (item?.children?.length) {
        const total = item.children.length;
        const checked = item.children.filter(child => this._selectedItems.has(child.id)).length;
        checkbox.indeterminate = checked > 0 && checked < total;
      } else {
        checkbox.indeterminate = false;
      }
    });
  }

  _updateChildrenState(item, state) {
    if (!item.children) return;
    item.children.forEach(child => {
      if (state) {
        this._selectedItems.add(child.id);
      } else {
        this._selectedItems.delete(child.id);
      }
      if (child.children?.length) {
        this._updateChildrenState(child, state);
      }
    });
  }

  updateParentItems(item) {
    if (!item.parentId) return;
    const parent = this._itemMap.get(item.parentId);
    if (!parent) return;

    const parents = this.getAllParents(item);
    parents.forEach(p => {
      let children = this._flatData.filter(i => i.parentId === parent.id);
      let allSelected = this.allChildSelected(children);
      let noneSelected = this.noneAllChildSelected(children);
      let optionsSelected = !allSelected && !noneSelected;
      let checked = false;
      let indeterminate = false;

      if (allSelected) {
        this._selectedItems.add(p.id);
        checked = true;
        indeterminate = false;
      } else if (noneSelected) {
        checked = false;
        indeterminate = false;
      } else if (optionsSelected) {
        this._selectedItems.delete(p.id);
        checked = true;
        indeterminate = true;
      }

      this.setParentState(p, checked, indeterminate);
    });
  }

  setParentState(parent, checked = false, indeterminate = false) {
    const checkbox = this.shadowRoot.querySelector(`#item-${parent.id}`);
    if (checkbox) {
      checkbox.checked = checked;
      checkbox.indeterminate = indeterminate;
    }
  }

  allChildSelected(items) {
    return items.every(child => this._selectedItems.has(child.id));
  }

  noneAllChildSelected(items) {
    return items.every(child => !this._selectedItems.has(child.id));
  }

  optionsChildSelected(items) {
    return !this.allChildSelected(items) && !this.noneAllChildSelected(items);
  }

  setParentsState(parents, checked, indeterminate) {
    parents.forEach(p => {
      p.checked = checked;
      p.indeterminate = indeterminate;
    });
  }

  getRootParent(item) {
    let current = item;
    while (current && current.parentId) {
      const parent = this._itemMap.get(current.parentId);
      if (!parent) break;
      current = parent;
    }
    return current;
  }

  getAllParents(item) {
    const parents = [];
    let current = item;
    while (current && current.parentId) {
      const parent = this._itemMap.get(current.parentId);
      if (!parent) break;
      parents.push(parent);
      current = parent;
    }
    return parents;
  }

  _updateChildrenCheckboxesUI(item, checked) {
    if (!item.children) return;
    item.children.forEach(child => {
      const checkbox = this.shadowRoot.querySelector(`#item-${child.id}`);
      if (checkbox) {
        checkbox.checked = checked;
        checkbox.indeterminate = false;
      }
      if (child.children?.length) {
        this._updateChildrenCheckboxesUI(child, checked);
      }
    });
  }

  escapeHtml(unsafe) {
    return unsafe?.toString().replace(/[&<"'>]/g, match => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[match])) || '';
  }

  renderTreeItem(item, level = 1) {
    const hasChildren = item.children?.length > 0;
    const isSelected = this._selectedItems.has(item.id);
    const isExpanded = this._expandedItems.has(item.id);

    return `
      <li class="tree-item" role="treeitem" aria-expanded="${isExpanded}" aria-level="${level}">
        <div class="item-content" data-id="${item.id}" tabindex="0">
          ${hasChildren ? `<span class="toggle" role="button">${isExpanded ? '▼' : '▶'}</span>` : `<span class="spacer"></span>`}
          <input type="checkbox" id="item-${item.id}" ${isSelected ? 'checked' : ''} role="none">
          <label for="item-${item.id}">${this.escapeHtml(item.name)}</label>
        </div>
        ${hasChildren ? `
          <ul class="tree-subtree" role="group" style="display: ${isExpanded ? 'block' : 'none'};">
            ${item.children.map(child => this.renderTreeItem(child, level + 1)).join('')}
          </ul>` : ''}
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
      <ul class="tree" role="tree">
        ${this._treeData.map(item => this.renderTreeItem(item)).join('')}
      </ul>
    `;
  }

 getSelectedIdsOnly() { // получить список идентификаторов 
  const leafIds = [];
    for (const id of this._selectedItems) {
       const item = this._itemMap.get(id);
        leafIds.push(id);
     }
  return leafIds;
 }


}

customElements.define('tree-selector', TreeSelector);
