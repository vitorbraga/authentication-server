export const subjectTemplates = {
    PASSWORD_RESET: 'Password reset'
};

export const bodyTemplates = {
    PASSWORD_RESET: '<p>Dear {name},<br>We received your request to reset your account password. By clicking the link below, ' +
        'you are presented with a form to choose a new password.</p><p>Please note that this link only works for 5 hours. If this link is ' +
        'expired, please generate another link.</p>' +
        '<p><a href={url}>Reset you password</a></p><p>King regards.</p>'
}