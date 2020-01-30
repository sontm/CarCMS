
class AppUtils {
    CONSOLE_LOG(s) {
        if (true) {
            console.log(s)
        }
    }
    createUserFromRecordForJWT(userRecord) {
        if (userRecord) {
            let result = {
                'id': userRecord.id,
                'userServiceId': userRecord.userServiceId,
                'email': userRecord.email,
                'phone': userRecord.phone,
                'fullName': userRecord.fullName,
                'pictureUrl': userRecord.pictureUrl,
                'type': userRecord.type,
                'class': userRecord.class,
                'accessToken': userRecord.accessToken,
                teamId: userRecord.teamId,
                teamCode: userRecord.teamCode,
                roleInTeam: userRecord.roleInTeam,
            }
            return result;
        }
        return {};
    }
    // Co Dau thanh Khong Dau
    changeVietnameseToNonSymbol(alias) {
        var str = alias;
        str = str.toLowerCase();
        // ES2015/ES6 String.Prototype.Normalize()
        str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
        str = str.replace(/đ/g,"d");
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
        str = str.replace(/ + /g," ");
        str = str.trim(); 
        return str;
    }
    makeRandomAlphaNumeric(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
const apputil = new AppUtils();
export default apputil;