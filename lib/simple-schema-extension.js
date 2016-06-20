SimpleSchema.extendOptions({
  displayAs: Match.Optional(Match.Any),
  allowFilter: Match.Optional(Boolean),
  allowEdit: Match.Optional(Boolean),
  denyQuickEdit: Match.Optional(Boolean),
  isTextArea: Match.Optional(Boolean),
  isRichTextArea: Match.Optional(Boolean),
});

SimpleSchema.messages({
  requiredEndorsement: "Teacher must have the required endorsements"
})
