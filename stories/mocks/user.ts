type UserModel = {
  id: number;
  username: string;
  fullName: string;
  email: string;
};

export const MOCK_USER_LIST: UserModel[] = [
  {
    id: 1,
    username: "john.doe",
    fullName: "John Doe",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    username: "jane.doe",
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
  },
  {
    id: 3,
    username: "jim.beam",
    fullName: "Jim Beam",
    email: "jim.beam@example.com",
  },
  {
    id: 4,
    username: "jill.doe",
    fullName: "Jill Doe",
    email: "jill.doe@example.com",
  },
  {
    id: 5,
    username: "jack.doe",
    fullName: "Jack Doe",
    email: "jack.doe@example.com",
  },
  {
    id: 6,
    username: "alex.morgan",
    fullName: "Alex Morgan",
    email: "alex.morgan@example.com",
  },
  {
    id: 7,
    username: "sarah.lee",
    fullName: "Sarah Lee",
    email: "sarah.lee@example.com",
  },
  {
    id: 8,
    username: "michael.chen",
    fullName: "Michael Chen",
    email: "michael.chen@example.com",
  },
  {
    id: 9,
    username: "emily.wong",
    fullName: "Emily Wong",
    email: "emily.wong@example.com",
  },
  {
    id: 10,
    username: "david.kim",
    fullName: "David Kim",
    email: "david.kim@example.com",
  },
  {
    id: 11,
    username: "olivia.garcia",
    fullName: "Olivia Garcia",
    email: "olivia.garcia@example.com",
  },
  {
    id: 12,
    username: "daniel.nguyen",
    fullName: "Daniel Nguyen",
    email: "daniel.nguyen@example.com",
  },
  {
    id: 13,
    username: "sophia.martinez",
    fullName: "Sophia Martinez",
    email: "sophia.martinez@example.com",
  },
  {
    id: 14,
    username: "james.patel",
    fullName: "James Patel",
    email: "james.patel@example.com",
  },
  {
    id: 15,
    username: "emma.johnson",
    fullName: "Emma Johnson",
    email: "emma.johnson@example.com",
  },
  {
    id: 16,
    username: "william.brown",
    fullName: "William Brown",
    email: "william.brown@example.com",
  },
  {
    id: 17,
    username: "ava.davis",
    fullName: "Ava Davis",
    email: "ava.davis@example.com",
  },
  {
    id: 18,
    username: "benjamin.miller",
    fullName: "Benjamin Miller",
    email: "benjamin.miller@example.com",
  },
  {
    id: 19,
    username: "mia.wilson",
    fullName: "Mia Wilson",
    email: "mia.wilson@example.com",
  },
  {
    id: 20,
    username: "lucas.moore",
    fullName: "Lucas Moore",
    email: "lucas.moore@example.com",
  },
  {
    id: 21,
    username: "charlotte.taylor",
    fullName: "Charlotte Taylor",
    email: "charlotte.taylor@example.com",
  },
  {
    id: 22,
    username: "henry.anderson",
    fullName: "Henry Anderson",
    email: "henry.anderson@example.com",
  },
  {
    id: 23,
    username: "amelia.thomas",
    fullName: "Amelia Thomas",
    email: "amelia.thomas@example.com",
  },
  {
    id: 24,
    username: "ethan.jackson",
    fullName: "Ethan Jackson",
    email: "ethan.jackson@example.com",
  },
  {
    id: 25,
    username: "isabella.white",
    fullName: "Isabella White",
    email: "isabella.white@example.com",
  },
];

export const getUserList = async ({
  page = 1,
  pageSize = 10,
  search = "",
}: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<{
  data: UserModel[];
  total: number;
}> => {
  const filteredUsers = MOCK_USER_LIST.filter((user) =>
    user.fullName.toLowerCase().includes(search.toLowerCase()),
  );
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = filteredUsers.slice(startIndex, endIndex);
  const total = filteredUsers.length;
  return new Promise((resolve) => {
    setTimeout(
      () => {
        resolve({
          data,
          total,
        });
      },
      Math.floor(Math.random() * 2000) + 500,
    );
  });
};

export const getUserById = async (id: number): Promise<UserModel | null> => {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        resolve(MOCK_USER_LIST.find((user) => user.id === id) ?? null);
      },
      Math.floor(Math.random() * 2000) + 500,
    );
  });
};
