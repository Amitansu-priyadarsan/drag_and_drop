export const saveTree = async (treeData) => {
  try {
    const response = await fetch("/api/nodes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(treeData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to save tree data. Status: ${response.status}. Message: ${errorText}`
      );
    }

    // In a real app, you might want to return something or handle success differently.
    console.log("Tree saved successfully!");
    return await response.json();
  } catch (error) {
    console.error("Error saving tree:", error);
    // Re-throw or handle error as appropriate for your app's UX
    throw error;
  }
}; 