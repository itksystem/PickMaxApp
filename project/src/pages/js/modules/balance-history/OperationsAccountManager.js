class OperationsAccountManager {
    constructor(parent) {
        this.parent = parent;  // Сохраняем ссылку на родителя
        this.api = parent.api;  // Используем api из родителя
        this.webRequest = parent.webRequest;  // Используем webRequest из родителя
    }


     createOperationsSection(){
        // Инициализация
//      let debitSection =  DOMHelper.createDropdownSection("Зачисление средств",  []);
        const container = document.createElement('div');
        this.createTransactionsView(container, (transaction) => {
           console.log('Выбрана операция:', transaction);
         });
//      debitSection.appendChild(container);
        return container;
     }	


    createTransactionsView(containerElement, onTransactionClick) {
        try {
            const groupedTransactions = this.getGroupedTransactions();
            this.renderGroupedTransactions(containerElement, groupedTransactions, onTransactionClick);
        } catch (error) {
            console.error('Ошибка при создании представления операций:', error);
            toastr.error('Ошибка при загрузке операций', 'Операции', { timeOut: 3000 });
            this.renderErrorState(containerElement);
        }
    }

    getGroupedTransactions() {
        const operations = this.getPaymentDebitBalanceOperations();
        const transactions = operations.length > 0 ? operations : this.getDemoTransactions();
        return this.groupTransactionsByDate(transactions);
    }

    groupTransactionsByDate(transactions) {
        const groups = {};
        
        transactions.forEach(transaction => {
            const date = new Date(transaction.createdAt);
            const year = date.getFullYear();
            const month = date.getMonth();
            const monthName = date.toLocaleString('ru-RU', { month: 'long' });
            const groupKey = `${year}-${month}`;
            
            if (!groups[groupKey]) {
                groups[groupKey] = {
                    year,
                    month: monthName,
                    transactions: [],
                    income: 0,
                    expense: 0
                };
            }
            
            groups[groupKey].transactions.push(transaction);
            
            if (transaction.amount >= 0) {
                groups[groupKey].income += transaction.amount;
            } else {
                groups[groupKey].expense += transaction.amount;
            }
        });
        
        return Object.values(groups)
            .sort((a, b) => b.year - a.year || b.month - a.month)
            .map(group => ({
                ...group,
                transactions: group.transactions.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )
            }));
    }

    renderGroupedTransactions(container, groups, onTransactionClick) {
        container.innerHTML = '';
        
        if (groups.length === 0) {
            this.renderEmptyState(container);
            return;
        }
        
        groups.forEach(group => {
            const groupElement = this.createGroupElement(group, onTransactionClick);
            container.appendChild(groupElement);
        });
    }

    createGroupElement(group, onTransactionClick) {
        const groupElement = document.createElement('div');
        groupElement.className = 'transaction-group';
        
        const header = document.createElement('div');
        header.className = 'group-header';
        header.innerHTML = `
            <h3 class="group-title">${this.capitalizeFirstLetter(group.month)} ${group.year}</h3>
            <div class="group-totals-title row">
                <div class="income col-4">Доход:</div>
                <div class="expense col-4">Расход:</div>
                <div class="balance col-4">Итого:</div>
            </div>
            <div class="group-totals row">
                <div class="income col-4">${this.formatAmount(group.income)}</div>
                <div class="expense col-4">${this.formatAmount(group.expense)}</div>
                <div class="balance col-4">${this.formatAmount(group.income + group.expense)}</div>
            </div>
        `;
        groupElement.appendChild(header);
        
        const list = document.createElement('div');
        list.className = 'transaction-list';
        
        group.transactions.forEach(transaction => {
            const item = this.createTransactionItem(transaction, onTransactionClick);
            list.appendChild(item);
        });
        
        groupElement.appendChild(list);
        return groupElement;
    }

    createTransactionItem(transaction, onClick) {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.dataset.id = transaction.transactionId;
        
        item.innerHTML = `
            <div class="transaction-icon ${this.getTransactionIconClass(transaction.transactionType)}">
                <i class="${this.getTransactionIcon(transaction.transactionType)}"></i>
            </div>
            <div class="transaction-content">
                <div class="transaction-main">
                    <span class="description">${transaction.description || 'Без описания'}</span>
                    <span class="amount ${transaction.amount >= 0 ? 'income' : 'expense'}">
                        ${this.formatAmount(transaction.amount)}
                    </span>
                </div>
                <div class="transaction-meta">
                    <span class="date">${this.formatDate(transaction.createdAt)}</span>
                    <span class="status ${transaction.status.toLowerCase()}">${transaction.status}</span>
                </div>
            </div>
        `;
        
        if (onClick) {
            item.addEventListener('click', () => onClick(transaction));
            item.classList.add('clickable');
        }
        
        return item;
    }

    getPaymentDebitBalanceOperations() {
        try {
            const response = this.webRequest.get(
                this.api.getPaymentDebitBalanceOperationsMethod(), 
                {}, 
                true
            );
            return response?.status ? response.operations : [];
        } catch (error) {
            console.error('Ошибка при загрузке операций:', error);
            return [];
        }
    }

    getDemoTransactions() {
        return [
            {
                transactionId: "TXN10001",
                transactionType: "Покупка",
                amount: -1250.50,
                status: "Завершено",
                description: "Оплата в магазине 'Пятёрочка'",
                createdAt: '2023-05-14T09:15:47Z'
            },
            {
                transactionId: "TXN10002",
                transactionType: "Пополнение",
                amount: 5000.00,
                status: "Завершено",
                description: "Перевод от Иван Иванов",
                createdAt: '2023-05-15T09:15:47Z'
            },
            {
                transactionId: "TXN10001",
                transactionType: "Покупка",
                amount: -1250.50,
                status: "Завершено",
                description: "Оплата в магазине 'Пятёрочка'",
                createdAt: '2023-06-14T09:15:47Z'
            },
            {
                transactionId: "TXN10002",
                transactionType: "Пополнение",
                amount: 5000.00,
                status: "Завершено",
                description: "Перевод от Иван Иванов",
                createdAt: '2023-07-14T09:15:47Z'
            },
            {
                transactionId: "TXN10002",
                transactionType: "Пополнение",
                amount: 5000.00,
                status: "Завершено",
                description: "Перевод от Иван Иванов",
                createdAt: '2023-07-15T09:15:47Z'
            },
            {
                transactionId: "TXN10002",
                transactionType: "Пополнение",
                amount: 5000.00,
                status: "Завершено",
                description: "Перевод от Иван Иванов",
                createdAt: '2023-07-16T09:15:47Z'
            },
            {
                transactionId: "TXN10002",
                transactionType: "Пополнение",
                amount: 5000.00,
                status: "Завершено",
                description: "Перевод от Иван Иванов",
                createdAt: '2023-08-14T09:15:47Z'
            },
        ];
    }

    getTransactionIconClass(type) {
        const types = {
            'Покупка': 'shopping',
            'Перевод': 'transfer',
            'Пополнение': 'deposit',
            'Комиссия': 'fee',
            'Отмена': 'cancel'
        };
        return types[type] || 'default';
    }

    getTransactionIcon(type) {
        const icons = {
            'Покупка': 'fa-solid fa-cart-shopping',
            'Перевод': 'fa-solid fa-exchange-alt',
            'Пополнение': 'fa-solid fa-plus-circle',
            'Комиссия': 'fa-solid fa-percentage',
            'Отмена': 'fa-solid fa-undo'
        };
        return icons[type] || 'fa-solid fa-receipt';
    }

    formatAmount(amount) {
        return `${amount >= 0 ? '+' : ''}${amount.toFixed(2)} ₽`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    renderEmptyState(container) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-wallet"></i>
                <p>Нет операций за выбранный период</p>
            </div>
        `;
    }

    renderErrorState(container) {
        container.innerHTML = `
            <div class="error-state">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <p>Не удалось загрузить операции</p>
                <button class="retry-button">Повторить попытку</button>
            </div>
        `;
        
        container.querySelector('.retry-button').addEventListener('click', () => {
            this.createTransactionsView(container);
        });
    }
}
