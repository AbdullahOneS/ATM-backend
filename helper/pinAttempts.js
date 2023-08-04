const { pool } = require("../config/db");

// function getDateTime24HoursAgo() {
//     const now = new Date();
//     now.setHours(now.getHours() - 24);
//     return now.toISOString();
// }  

function failedPinAttempts(card_no) {
    // const dateTime24HoursAgo = getDateTime24HoursAgo();
    // console.log(dateTime24HoursAgo);
    const selectSql = `SELECT COUNT(*) as count 
    FROM pin_attempt 
    WHERE card_no=? AND date_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR);`;
    pool.query(selectSql, [card_no], (err, result) => {
        if (err) {
            console.error("Error checking pin attempts:", err);
            return;
        }
        
        console.log("count");
        const count = result[0].count;
        console.log(count);
        if (count === 2) {
            const updateCardSql = `UPDATE card SET status='inactive' WHERE card_no=?;`;
            pool.query(updateCardSql, [card_no], (err, result) => {
                if (err) {
                    console.error("Error updating card status:", err);
                    return;
                }
                
           
                
                // Insert the inactive card into inactive_cards table
                const inactiveDateTime = new Date().toISOString();
                const insertInactiveCardSql = `INSERT INTO inactive_card (card_no) VALUES (?);`;
                pool.query(insertInactiveCardSql, [card_no, inactiveDateTime], (err, result) => {
                    if (err) {
                        console.error("Error inserting inactive card:", err);
                        return;
                    }
                });
                deleteAttemptsByCardNo(card_no);
        });
    } else {
        // const dateTimeNow = new Date().toISOString();
        const insertSql = `INSERT INTO pin_attempt (card_no) VALUES (?);`;
        pool.query(insertSql, [card_no], (err, result) => {
            if (err) {
                console.error("Error inserting pin attempt:", err);
                return;
            }
        });
    }
});
}

function deleteAttemptsByCardNo(card_no) {
    
    const deleteSql = `DELETE FROM pin_attempt WHERE card_no=?;`;
    pool.query(deleteSql, [card_no], (err, result) => {
        if (err) {
            console.error("Error deleting pin attempt:", err);
            return;
        }
    });
}

// const updateCardSql = `UPDATE card SET status='active' WHERE card_no=?;`;
//     pool.query(updateCardSql, [card_no], (err, result) => {
//         if (err) {
//             console.error("Error updating card status:", err);
//             return;
//         }
        
//     });

module.exports = { failedPinAttempts, deleteAttemptsByCardNo }