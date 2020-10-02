/**
 |---------------------------------------------------------
 | Request Controller
 | to hold api response code and status
 |---------------------------------------------------------
 */
class HelperController {
  /**
   * Generate random string
   * by length
   * @param {Number} numLength
   */
  static str_random(numLength = 0) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < numLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Generate random number
   * by length
   * @param {Number} numLength
   */
  static random(numLength = 0){
    var result = '';
    var numbers = '0123456789';
    var numbersLength = numbers.length;
    for (var i = 0; i < numLength; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbersLength));
    }
    return result;
  }

  /**
   * Generate uniqid
   */
  static uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

module.exports = HelperController;