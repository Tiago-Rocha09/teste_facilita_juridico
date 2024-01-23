function getOnlyNumbers(string) {
  return string?.replace(/[^0-9]/g, "") || "";
}

export { getOnlyNumbers };
