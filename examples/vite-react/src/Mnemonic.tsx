import { useLofikAccount, useLofikAccountActions } from "@lofik/react";

export const Mnemonic = () => {
  const { currentMnemonic } = useLofikAccount();
  const { generateNewAccount, setAccountFromMnemonic } =
    useLofikAccountActions();

  return (
    <div>
      <p>{currentMnemonic}</p>
      <button onClick={generateNewAccount}>new account</button>
      <button
        onClick={() => {
          const mnemonic = prompt("enter mnemonic");

          if (!mnemonic) {
            alert("missing mnemonic");

            return;
          }

          setAccountFromMnemonic(mnemonic);
        }}
      >
        set account
      </button>
    </div>
  );
};
