Remaiaining task:
Check whether each important request variable is passed or not at first only as done in undefined

remove all logs once testing is done


Completed Task: 
Balance update and send for all three (fund_tranfer, deposit, withdrawal) (DONE)

Withdrawal limit (10k) (DONE)
    take account_no from authentication middleware

Fund transfer limit (20k) (DONE)

Withdrawal + fund transfer limit (25k) (DONE)
    in the withdrawal and fund transfer route after authentication add this middleware that check from transaction.

Withdrawal denomination suggestion (UX) (MOST PROBABLY NOT NEEDED)

Discussion: 
Our APIs are fully exposed
like verification is done seperately so withdrawal, account_transfer, check_balnace will work even if card is inactive and blocked
withdrawal, fund transfer validation limits are handled at the frontend only so if someone adds more than limit withdrwal from API no checks are maintained.

denomincations (n_100...), atm_id, branch_name, location