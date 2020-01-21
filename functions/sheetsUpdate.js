const {google} = require('googleapis');
const sheets = google.sheets('v4');

const serviceAccount = {
  "type": "service_account",
  "project_id": "test-pclcyl",
  "private_key_id": "c3ccd476801151ea0e57f46d618a24df8e3675db",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDnHbLxmYIJpncd\nkC0k+V1uHUycd16Q7F6G+EUmBkvTUSKCf3tfQcv4xx3Cg/gmIM4Evt6A5V+oeS+p\nqtLADdnTfYM4VFKlm0J3CiVfbtYJmXliW/r2fiuleMIJH8SFtf/36x188r9nMSC4\ncc2MQBby1kirYA9mZIyqs/3cWVrxAiBli3iai5LUfx10HOP8f9lN5pQaIyErzG7U\nwus3bxuXUTT/87TUzESy123RkFaf9Ut/EQuCgWrZpGviqEtRyGrjDOt/c2SL/45o\n3Zrd28AXLGVhsSOeLKMA30w6zuhCEJkUOBYShBOzh5cMcv9XEbJLkjMwsMnjJAxh\nAlc2lA+dAgMBAAECggEAIQ0b/VWO5WrnL3TiI96+eAQcI+clQLPw27vvBZ5SYyy/\n8uogvlFmRlRRYvMk/mzkEYUrREMpMCpugMTTYVBJxac2KAzVCeZfda8fg5uR4+sN\nEx4k0HHgM4iGtS/UFqwdqDp5K9h6O1to+r+ZndQ/g+hVmZ6B7Up1XGcjp4qmyP7X\nh3KmjB3U1F6Fa/VxXPtB531rvFeW0PIZu0RcbpZrbN5uSvbBhgOrYVmZLlDGs1I0\n00r6cMGZzowxLgJRwpzAlwJaWLo/dHIv5+2erWBYYib2+0jTGZvb+f7qAnye1aYA\nRZS/K48dVvFoUZ+mog4z16xC86/KDw9IiafsOJEQSQKBgQD295bph3rmzfQixKsx\nQLPJXsqNz0eGeSOH/OpGtwuYq/xbMqJdi6OFwTVsCiTg/lBlxT/fJ9Ti355kTfzo\nEqxHQHIcwv934NZsqNRtNxYLIiU5eK+nI+8taD93uKaFmHGIQxyPXRDD09vp4f9Y\nuof5L57kozsYzC4e9/13IX8D1QKBgQDvkbEQf26+xYf8tsglrQJ/JxNAGoQAdTC7\nmA6f5oB6b99+5RLG65ni2vZVVkGXrS/nk5F4E+aGe+QnOCQauJkzZTruHlbX0Lwm\nerCkSTnJgvIROUg4g3k6dsATL0ZOgrrQEKzTnJtWbXtPAuMkcA9+IGSeTlezSurg\nPUhRkXxoqQKBgQCqme4N9CDaP3teaS05INERUgHqZD2sjxIUZooPv3KrTGNPPHMc\n29FiHE2jDH7dTdCL/O5aYVGWR5NLBvSl/AA2WDZ719hSH2cAOMBFkcAQgM3mHZB5\njUEzxMfTFCM0NlJ3JqUcA9YI8NkBf7S8vl4frN2+Y2P3hVR24Cifmuv64QKBgQC/\nSZyRKL9bskuv3J6Zfrh0oNW9JK7r0qcT0wkyYhGKMdPJ9cz1al/YhK+WWiZLnuyW\nQv0vXOx/y2LUcf5aG7WwFQ9l3HHJJxFkxChRNWrf3R+94vgor8nXhcQ+TUwdGkNi\nKT5mRTC/ZPHFl++YQ6YLNoBA6xsZvSMn46bgAoPM6QKBgBiFQ7J0MLWclqmeAqst\nFUa1gIjwWvrrge7rRBuTWK8TGGxI/+rwI821o/Ia9iKOvz647laDywI4eXP0WAjM\nsdhCc9heyZdt/gYuaRP+xe4/olCng4TGwL5qkbeO9rQBVsBfgoPVik1ZUnU2n83V\nvQ3/Tufelv2Nvc11FfS3GmpJ\n-----END PRIVATE KEY-----\n",
  "client_email": "dialogflow-aoiegw@test-pclcyl.iam.gserviceaccount.com",
  "client_id": "112033180112563690046",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/dialogflow-aoiegw%40test-pclcyl.iam.gserviceaccount.com"
}

const client = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file']
});
const SPREADSHEET_ID = '1vPzp6y81OwvaKgpOeByYHmtAxFaOCtDRAzNRltuek0Q';
const API_KEY = 'AIzaSyCwHTaVxAxuHAL-tFzekoIfwNu95cmloyM';

module.exports = function (input) {
  var request = {
    spreadsheetId: SPREADSHEET_ID,
    key: API_KEY,
    range: 'Sheet1',
    valueInputOption: 'USER_ENTERED',  // TODO: Update placeholder value.
    resource: {
      "values": [
        [
          `${input}`
        ]
      ]
    },
    auth: client,
  };

  sheets.spreadsheets.values.append(request, function(err, response) {
    if (err) {
      console.error(err);
      return;
    }

    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
  });
};
