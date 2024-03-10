export default function Team() {

  return (
    <main>
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex max-w-lg flex-col justify-center items-center">
          <h1 className="font-bold text-2xl mb-5">CS35L Team Project Members</h1>
          <table className="text-center table-fixed w-full border-b">
            <tr className="border-b">
              <th>GitHub</th>
              <th>Name</th>
            </tr>
            <tr className="border-b p-4">
              <td className="p-2">Jamiezoomies</td>
              <td>Tae Hwan Kim</td>
            </tr>
            <tr className="border-b">
              <td  className="p-2">jonpaino</td>
              <td>Jonathan Paino</td>
            </tr>
            <tr className="border-b">
              <td  className="p-2">Mykol-Word</td>
              <td>Michael Ward</td>
            </tr>
            <tr className="border-b">
              <td  className="p-2">Jusbusy</td>
              <td>Justin Morgan</td>
            </tr>
            <tr className="border-b">
              <td  className="p-2">fernandotorresvargas</td>
              <td>Fernando Torres Vargas</td>
            </tr>
          </table>
        </div>
      </div>
    </main>
  )
}
