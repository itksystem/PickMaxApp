class AccountBalanceManager {
    constructor() {
        this.api = new WebAPI();
        this.webRequest = new WebRequest();    
        this.addEventListeners();
    }

    createAccountBalanceSection(data) {
        this.accountBalanceContainer = DOMHelper.createElement("div", "account-balance-card-container");
        const elements = [
             DOMHelper.createProfileBalanceItem(
                "Баланс", 
                "balance", 
                ``, 
                   false, 
                "Сумма баланса пользователя", 
                `${data?.profile?.balance ? data?.profile?.balance : 99999}  ₽`, 
                `w-100 text-end account-balance`
            ),
            DOMHelper.createConfirmationLabel(
		(data?.profile?.lastPaidDate ? `Последний платеж от ${data?.profile?.lastPaidDate}` :  ``), 
		`account-balance`),
            DOMHelper.createButton(
                `Внести средства`,
                `text-end account-add-button`, 
                this.addAccount.bind(this)
            ),
            DOMHelper.createLinkButton(
                `История операций`,
                `text-end account-history-button`, 
                this.history.bind(this)
            )

        ];
        return DOMHelper.createDropdownSection("Мой баланс", elements);
    }

   addAccount(){
    document.location.replace('/balance/deposit/page');
   }

   history(){
    document.location.replace('/balance/history/page');
   }


   addEventListeners(){

   }

}