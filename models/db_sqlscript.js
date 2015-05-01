/**
 * Created by ProgrammingPearls on 15. 5. 1..
 */

exports.sqlFindAuth = "select couple_no, count(*) as cnt from couple where auth_phone=? and couple_is=0";

