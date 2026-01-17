export function formatAddress(address: string, length = 5) {
  if (address.length <= length * 2) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

export function formatType(type: string) {
  const parts = type.split("::");
  if (parts.length < 3) return type;

  const moduleName = parts[1];
  const structName = parts[2].split("<")[0];

  return `${moduleName}::${structName}`;
}
